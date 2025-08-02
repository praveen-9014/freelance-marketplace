import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthForm from './components/Auth/AuthForm';
import MyProjects from './components/Client/MyProjects';
import PostProject from './components/Client/PostProject';
import BrowseProjects from './components/Freelancer/BrowseProjects';
import MyApplications from './components/Freelancer/MyApplications';
import { authAPI, projectsAPI, applicationsAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setCurrentView(JSON.parse(storedUser).role === 'CLIENT' ? 'projects' : 'browse-projects');
    }
  }, []);

  // Load projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.content || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      setCurrentView(newUser.role === 'CLIENT' ? 'projects' : 'browse-projects');
      
      return newUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      setCurrentView(newUser.role === 'CLIENT' ? 'projects' : 'browse-projects');
      
      return newUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setProjects([]);
    setApplications([]);
  };

  const addProject = async (projectData) => {
    try {
      const response = await projectsAPI.create(projectData);
      const newProject = response.data;
      await loadProjects();
      return newProject;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const addApplication = async (applicationData) => {
    try {
      const response = await applicationsAPI.create(applicationData);
      const newApplication = response.data;
      setApplications(prev => [newApplication, ...prev]);
      return newApplication;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create application');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await applicationsAPI.updateStatus(applicationId, status);
      const updatedApplication = response.data;
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? updatedApplication : app
        )
      );
      return updatedApplication;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const getProjectApplications = async (projectId) => {
    try {
      const response = await applicationsAPI.getByProject(projectId);
      return response.data.content || [];
    } catch (error) {
      console.error('Error loading project applications:', error);
      return [];
    }
  };

  const hasUserApplied = async (projectId) => {
    try {
      const response = await applicationsAPI.checkIfApplied(projectId);
      return response.data;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleProjectPosted = () => {
    setCurrentView('projects');
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  const renderContent = () => {
    if (user?.role === 'CLIENT') {
      switch (currentView) {
        case 'projects':
          return (
            <MyProjects 
              projects={projects}
              onLoadProjects={loadProjects}
              onUpdateApplicationStatus={updateApplicationStatus}
              onGetProjectApplications={getProjectApplications}
            />
          );
        case 'post-project':
          return <PostProject onProjectPosted={handleProjectPosted} onAddProject={addProject} />;
        default:
          return (
            <MyProjects 
              projects={projects}
              onLoadProjects={loadProjects}
              onUpdateApplicationStatus={updateApplicationStatus}
              onGetProjectApplications={getProjectApplications}
            />
          );
      }
    } else {
      switch (currentView) {
        case 'browse-projects':
          return (
            <BrowseProjects 
              projects={projects}
              onAddApplication={addApplication}
              onHasUserApplied={hasUserApplied}
            />
          );
        case 'my-applications':
          return (
            <MyApplications 
              applications={applications}
              onLoadApplications={loadProjects}
            />
          );
        default:
          return (
            <BrowseProjects 
              projects={projects}
              onAddApplication={addApplication}
              onHasUserApplied={hasUserApplied}
            />
          );
      }
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={handleViewChange}
      user={user}
      onLogout={logout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;