import React, { useState, useEffect } from 'react';
import {
  Calendar, DollarSign, Users, Clock, Loader, CheckCircle, XCircle
} from 'lucide-react';
import { applicationsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification';

const ApplicationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

function MyProjects({ onGetProjectApplications, updateApplicationStatus }) {
  const [myProjects, setMyProjects] = useState([]);
  const [projectApplications, setProjectApplications] = useState({});
  const [loading, setLoading] = useState({});
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [actionLoading, setActionLoading] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', budget: '', deadline: '', requiredSkills: '' });

  const navigate = useNavigate();

  const refreshProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/projects/client', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyProjects(data.content || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  useEffect(() => {
    myProjects.forEach(async (project) => {
      if (!projectApplications[project.id]) {
        setLoading((prev) => ({ ...prev, [project.id]: true }));
        try {
          const applications = await onGetProjectApplications(project.id);
          setProjectApplications((prev) => ({
            ...prev,
            [project.id]: applications
          }));
        } catch (error) {
          console.error('Error loading applications:', error);
        } finally {
          setLoading((prev) => ({ ...prev, [project.id]: false }));
        }
      }
    });
  }, [myProjects]);

  const handleApplicationAction = async (applicationId, status) => {
  setActionLoading(prev => ({ ...prev, [applicationId]: true }));

  try {
    // Update application status
    await applicationsAPI.updateStatus(applicationId, status);

    // Find the project ID that contains the application
    const projectId = Object.keys(projectApplications).find(key =>
      projectApplications[key].some(app => app.id === applicationId)
    );

    // Refresh applications for that project
    if (projectId) {
      const { data: updatedApplications } = await applicationsAPI.getByProject(projectId);
      setProjectApplications(prev => ({
        ...prev,
        [projectId]: updatedApplications.content || updatedApplications // handle paginated or raw list
      }));
    }

    // Prepare and show notification
    const action = status === ApplicationStatus.ACCEPTED ? 'selected and accepted' : 'rejected';
    const freelancerName = projectApplications[projectId]?.find(app => app.id === applicationId)?.freelancer?.name || 'Freelancer';

    setNotification({
      show: true,
      message: `${freelancerName} ${action} successfully! They will be notified.`,
      type: 'success',
    });

    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  } catch (error) {
    console.error('Error updating application status:', error);
    setNotification({
      show: true,
      message: 'Failed to update application status. Please try again.',
      type: 'error',
    });

    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 3000);
  } finally {
    setActionLoading(prev => ({ ...prev, [applicationId]: false }));
  }
};

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setMyProjects((prev) => prev.filter((p) => p.id !== projectId));
        setNotification({ show: true, message: 'Project deleted.', type: 'success' });
      } else {
        const err = await res.text();
        throw new Error(err);
      }
    } catch (err) {
      console.error(err);
      setNotification({ show: true, message: 'Could not delete project. It may have dependencies.', type: 'error' });
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      budget: project.budget,
      deadline: project.deadline,
      requiredSkills: (project.requiredSkills || []).join(', ')
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async () => {
    try {
      const updated = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim())
      };

      const response = await fetch(`http://localhost:8080/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });

      if (!response.ok) throw new Error('Update failed');

      setShowEditModal(false);
      refreshProjects();
      setNotification({ show: true, message: 'Project updated.', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ show: true, message: 'Update failed.', type: 'error' });
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const getStatusBadge = (status) => {
    const map = {
      OPEN: 'bg-success',
      IN_PROGRESS: 'bg-warning',
      COMPLETED: 'bg-info'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  if (projectsLoading) {
    return <div className="text-center"><Loader className="animate-spin" /></div>;
  }
  

  return (
    <div>
      <h2 className="h3 mb-4">My Projects</h2>

      {myProjects.map(project => {
        const applications = projectApplications[project.id] || [];
        const isLoading = loading[project.id];

        return (
          <div key={project.id} className="card mb-5">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>{project.name}</h5>
                  <p>{project.description}</p>
                  <div className="d-flex gap-3 text-muted">
                    <small><DollarSign size={14} /> ${project.budget}</small>
                    <small><Calendar size={14} /> {formatDate(project.deadline)}</small>
                    <small><Clock size={14} /> {project.duration || 0} days</small>
                  </div>
                  <div className="mt-2">{getStatusBadge(project.status)}</div>

                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {(project.requiredSkills || []).map((skill, index) => (
                      <span key={index} className="badge bg-primary text-light">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => openEditModal(project)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
              </div>

              <div className="mt-4">
                <h6>Applications ({applications.length})</h6>
                {isLoading ? (
                  <div className="text-muted">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="text-muted">No applications yet.</div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="border p-3 rounded mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{app.freelancer?.name}</strong> - {app.freelancer?.email}
                          <p>{app.proposalMessage}</p>
                          <small>${app.expectedPrice}</small> |
                          {app.portfolioLink && (
                            <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="ms-2 text-primary">Portfolio</a>
                          )}
                        </div>
                        <div>
                          {app.status === ApplicationStatus.PENDING && (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={() => handleApplicationAction(app.id, ApplicationStatus.ACCEPTED)}>
                                {actionLoading[app.id] ? <Loader className="animate-spin" size={14} /> : 'Accept'}
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleApplicationAction(app.id, ApplicationStatus.REJECTED)}>
                                {actionLoading[app.id] ? <Loader className="animate-spin" size={14} /> : 'Reject'}
                              </button>
                            </>
                          )}
                          {app.status === ApplicationStatus.ACCEPTED && <span className="badge bg-success">Accepted</span>}
                          {app.status === ApplicationStatus.REJECTED && <span className="badge bg-danger">Rejected</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <textarea className="form-control mb-2" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <input type="number" className="form-control mb-2" placeholder="Budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                <input type="date" className="form-control mb-2" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                <input className="form-control" placeholder="Required Skills (comma separated)" value={formData.requiredSkills} onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateProject}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />
    </div>
  );
}

export default MyProjects;
