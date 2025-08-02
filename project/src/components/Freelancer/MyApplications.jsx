import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { ApplicationStatus } from '../../types';
import Notification from '../Notification';

function MyApplications({ applications, onLoadApplications }) {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const refreshApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/applications/freelancer', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newApplications = data.content || [];
        
        newApplications.forEach(newApp => {
          const oldApp = myApplications.find(app => app.id === newApp.id);
          if (oldApp && oldApp.status !== newApp.status) {
            if (newApp.status === ApplicationStatus.ACCEPTED) {
              setNotification({
                show: true,
                message: `Congratulations ${newApp.freelancer?.name || 'You'}! You've been selected for "${newApp.project?.title}"!`,
                type: 'success'
              });
            } else if (newApp.status === ApplicationStatus.REJECTED) {
              setNotification({
                show: true,
                message: `${newApp.freelancer?.name || 'Your'} application for "${newApp.project?.title}" was not selected.`,
                type: 'error'
              });
            }
            
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
              setNotification({ show: false, message: '', type: 'info' });
            }, 5000);
          }
        });
        
        setMyApplications(newApplications);
        console.log('Refreshed applications:', newApplications);
      } else {
        console.error('Failed to load applications');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/applications/freelancer', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const newApplications = data.content || [];
          
          // Check for status changes and show notifications
          newApplications.forEach(newApp => {
            const oldApp = myApplications.find(app => app.id === newApp.id);
            if (oldApp && oldApp.status !== newApp.status) {
              if (newApp.status === ApplicationStatus.ACCEPTED) {
                setNotification({
                  show: true,
                  message: `🎉 Congratulations ${newApp.freelancer?.name || 'You'}! You've been selected for "${newApp.project?.title}"!`,
                  type: 'success'
                });
              } else if (newApp.status === ApplicationStatus.REJECTED) {
                setNotification({
                  show: true,
                  message: `${newApp.freelancer?.name || 'Your'} application for "${newApp.project?.title}" was not selected.`,
                  type: 'error'
                });
              }
              
              // Auto-hide notification after 5 seconds
              setTimeout(() => {
                setNotification({ show: false, message: '', type: 'info' });
              }, 5000);
            }
          });
          
          setMyApplications(newApplications);
          console.log('Loaded applications:', newApplications);
        } else {
          console.error('Failed to load applications');
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const getProjectById = (projectId) => {
    return myApplications.find(app => app.project?.id === projectId)?.project;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="text-success" style={{ width: '1.25rem', height: '1.25rem' }} />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="text-danger" style={{ width: '1.25rem', height: '1.25rem' }} />;
      case ApplicationStatus.PENDING:
        return <Clock className="text-warning" style={{ width: '1.25rem', height: '1.25rem' }} />;
      default:
        return <AlertCircle className="text-info" style={{ width: '1.25rem', height: '1.25rem' }} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'bg-warning', text: 'Pending' },
      'ACCEPTED': { class: 'bg-success', text: 'Accepted' },
      'REJECTED': { class: 'bg-danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Loader className="animate-spin mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (myApplications.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="card">
          <div className="card-body">
            <h3 className="h5 text-muted mb-3">No Applications Yet</h3>
            <p className="text-muted mb-4">
              You haven't applied to any projects yet. Browse available projects and start applying!
            </p>
            <button 
              onClick={refreshApplications}
              className="btn btn-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">My Applications</h2>
        </div>
        <button 
          onClick={refreshApplications}
          className="btn btn-outline-primary btn-sm"
        >
          Refresh
        </button>
      </div>

      <div className="row g-4">
        {myApplications.map((application) => (
          <div key={application.id} className="col-12">
            <div className="card shadow-sm card-hover">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="card-title mb-2">{application.project?.title}</h5>
                    <p className="card-text text-muted mb-3">
                      {application.project?.description?.length > 200 
                        ? `${application.project.description.substring(0, 200)}...` 
                        : application.project?.description
                      }
                    </p>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6 col-md-3">
                        <div className="d-flex align-items-center text-muted">
                          <DollarSign className="me-2" style={{ width: '1rem', height: '1rem' }} />
                          <small>${application.expectedPrice}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="d-flex align-items-center text-muted">
                          <Calendar className="me-2" style={{ width: '1rem', height: '1rem' }} />
                          <small>{formatDate(application.createdAt)}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="d-flex align-items-center text-muted">
                          <Clock className="me-2" style={{ width: '1rem', height: '1rem' }} />
                          <small>Applied {formatDate(application.createdAt)}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="d-flex align-items-center">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Your Cover Letter:</h6>
                      <p className="text-muted small mb-0">
                        {application.coverLetter?.length > 150 
                          ? `${application.coverLetter.substring(0, 150)}...` 
                          : application.coverLetter
                        }
                      </p>
                    </div>

                    {application.portfolioLink && (
                      <div className="mb-3">
                        <a
                          href={application.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <ExternalLink className="me-1" style={{ width: '0.875rem', height: '0.875rem' }} />
                          View Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <div className="text-end">
                      <div className="d-flex align-items-center justify-content-end mb-2">
                        {getStatusIcon(application.status)}
                        <span className="ms-2 fw-medium">
                          {application.status === ApplicationStatus.ACCEPTED && 'Selected!'}
                          {application.status === ApplicationStatus.REJECTED && 'Not Selected'}
                          {application.status === ApplicationStatus.PENDING && 'Under Review'}
                        </span>
                      </div>
                      
                      <div className="text-muted small">
                        <div>Client: {application.project?.client?.name || 'Anonymous'}</div>
                        <div>Budget: ${application.project?.budget}</div>
                        <div>Deadline: {formatDate(application.project?.deadline)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />
    </div>
  );
}

export default MyApplications;