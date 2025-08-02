import React from 'react';
import { LogOut, User, Briefcase, Users, PlusCircle } from 'lucide-react';

function Layout({ children, currentView, onViewChange, user, onLogout }) {
  const clientViews = [
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'post-project', label: 'Post Project', icon: PlusCircle },
  ];

  const freelancerViews = [
    { id: 'browse-projects', label: 'Browse Projects', icon: Briefcase },
    { id: 'my-applications', label: 'My Applications', icon: Users },
  ];

  const views = user?.role === 'CLIENT' ? clientViews : freelancerViews;

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-3">
                  <h1 className="h3 mb-0 gradient-text fw-bold ms-2">
                    WorkBridge
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end">
                <div className="d-flex align-items-center me-3 text-muted">
                  <User className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span className="fw-medium">{user?.name}</span>
                  <span className="badge bg-primary ms-2">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center"
                >
                  <LogOut className="me-1" style={{ width: '1rem', height: '1rem' }} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <nav className="nav flex-column">
                  {views.map((view) => {
                    const Icon = view.icon;
                    return (
                      <button
                        key={view.id}
                        onClick={() => onViewChange(view.id)}
                        className={`btn text-start mb-2 ${
                          currentView === view.id
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {view.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;