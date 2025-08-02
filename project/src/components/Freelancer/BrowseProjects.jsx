import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Search, Filter, Send, Loader } from 'lucide-react';
import { ProjectStatus } from '../../types';
import Notification from '../Notification';

function BrowseProjects({ projects, onAddApplication, onHasUserApplied }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedPrice: '',
    portfolioLink: ''
  });
  const [appliedProjects, setAppliedProjects] = useState(new Set());
  const [loading, setLoading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // Get available projects (not by current user)
  const [availableProjects, setAvailableProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Load available projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const projects = data.content || [];
          const filtered = projects.filter(
            project => project.status === ProjectStatus.OPEN && project.client?.id !== JSON.parse(localStorage.getItem('user'))?.id
          );
          setAvailableProjects(filtered);
        } else {
          console.error('Failed to load projects');
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    const checkAppliedProjects = async () => {
      const appliedSet = new Set();
      for (const project of availableProjects) {
        if (!loading[project.id]) {
          setLoading(prev => ({ ...prev, [project.id]: true }));
          try {
            const hasApplied = await onHasUserApplied(project.id);
            if (hasApplied) {
              appliedSet.add(project.id);
            }
          } catch (error) {
            console.error('Error checking application status:', error);
          } finally {
            setLoading(prev => ({ ...prev, [project.id]: false }));
          }
        }
      }
      setAppliedProjects(appliedSet);
    };

    if (availableProjects.length > 0) {
      checkAppliedProjects();
    }
  }, [availableProjects, onHasUserApplied]);

  const allSkills = [...new Set(
    availableProjects.flatMap(project => project.requiredSkills || [])
  )].sort();

  const filteredProjects = availableProjects.filter(project => {
    const title = project.title || project.name || '';
    const description = project.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !selectedSkill || (project.requiredSkills && project.requiredSkills.includes(selectedSkill));
    return matchesSearch && matchesSkill;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApplyClick = (project) => {
    setSelectedProject(project);
    setApplicationData({
      coverLetter: '',
      expectedPrice: '',
      portfolioLink: ''
    });
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const applicationPayload = {
        projectId: selectedProject.id,
        proposalMessage: applicationData.coverLetter,
        expectedPrice: parseFloat(applicationData.expectedPrice),
        portfolioLink: applicationData.portfolioLink
      };

      await onAddApplication(applicationPayload);
      
      setAppliedProjects(prev => new Set([...prev, selectedProject.id]));
      
      setNotification({
        show: true,
        message: `Application submitted successfully for "${selectedProject.title || selectedProject.name || 'Project'}"!`,
        type: 'success'
      });
      
      setShowApplicationModal(false);
      setSelectedProject(null);
      setApplicationData({
        coverLetter: '',
        expectedPrice: '',
        portfolioLink: ''
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'info' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setNotification({
        show: true,
        message: error.message || 'Failed to submit application. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationChange = (e) => {
    setApplicationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (projectsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Loader className="animate-spin mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading available projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Browse Projects</h2>
        </div>
        <div className="text-end">
          <p className="text-muted mb-1">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search style={{ width: '1rem', height: '1rem' }} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  placeholder="Search projects by title or description..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-5">
          <div className="card">
            <div className="card-body">
              <h3 className="h5 text-muted mb-3">No Projects Found</h3>
              <p className="text-muted">
                {searchTerm || selectedSkill 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No projects are currently available. Check back later!'
                }
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-lg-6 col-xl-4">
              <div className="card h-100 shadow-sm card-hover">
                <div className="card-body">
                  <h5 className="card-title mb-2">{project.title || project.name || 'Untitled Project'}</h5>
                                     <p className="card-text text-muted small mb-3">
                     {project.description && project.description.length > 150 
                       ? `${project.description.substring(0, 150)}...` 
                       : (project.description || 'No description available')
                     }
                   </p>
                  
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <DollarSign className="me-1" style={{ width: '0.875rem', height: '0.875rem' }} />
                        <small>${project.budget}</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <Calendar className="me-1" style={{ width: '0.875rem', height: '0.875rem' }} />
                        <small>{formatDate(project.deadline)}</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                     <div className="d-flex flex-wrap gap-1">
                       {(project.requiredSkills || []).slice(0, 3).map((skill, index) => (
                         <span key={index} className="badge bg-light text-dark">
                           {skill}
                         </span>
                       ))}
                       {project.requiredSkills && project.requiredSkills.length > 3 && (
                         <span className="badge bg-secondary">
                           +{project.requiredSkills.length - 3} more
                         </span>
                       )}
                     </div>
                   </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <User className="me-1" style={{ width: '0.875rem', height: '0.875rem' }} />
                      {project.client?.name || 'Anonymous'}
                    </small>
                    
                    {loading[project.id] ? (
                      <Loader className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                    ) : appliedProjects.has(project.id) ? (
                      <span className="badge bg-success">Applied</span>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(project)}
                        className="btn btn-primary btn-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showApplicationModal && selectedProject && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApplicationModal(false)}
                ></button>
              </div>
              <form onSubmit={handleApplicationSubmit}>
                <div className="modal-body">
                  <h5 className="mb-2 text-primary">
                    {selectedProject.title || selectedProject.name || 'Untitled Project'}
                  </h5>
                  <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                    <p className="mb-1 text-secondary small">
                      <strong>Description</strong>
                    </p>

                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedProject.description?.trim()
                        ? selectedProject.description
                        : 'No description available for this project.'}
                    </p>
                  </div>

                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      value={applicationData.coverLetter}
                      onChange={handleApplicationChange}
                      required
                      rows="4"
                      className="form-control"
                      placeholder="Describe why you are best fit for this project"
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-medium">Expected Price</label>
                        <input
                          type="number"
                          name="expectedPrice"
                          value={applicationData.expectedPrice}
                          onChange={handleApplicationChange}
                          required
                          min="1"
                          className="form-control"
                          placeholder="Enter your price"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-medium">Portfolio Link</label>
                        <input
                          type="url"
                          name="portfolioLink"
                          value={applicationData.portfolioLink}
                          onChange={handleApplicationChange}
                          className="form-control"
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowApplicationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showApplicationModal && (
        <div className="modal-backdrop fade show"></div>
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

export default BrowseProjects;