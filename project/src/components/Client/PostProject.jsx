import React, { useState } from 'react';
import { Plus, X, DollarSign, Calendar, FileText, Target } from 'lucide-react';

function PostProject({ onProjectPosted, onAddProject }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    deadline: '',
    duration: '',
    requiredSkills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        duration: parseInt(formData.duration)
      };

      await onAddProject(projectData);

      setSuccess(true);

      setFormData({
        name: '',
        description: '',
        budget: '',
        deadline: '',
        duration: '',
        requiredSkills: []
      });
      setSkillInput('');

      if (onProjectPosted) {
        onProjectPosted();
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error?.message || 'Something went wrong while posting the project.');
      console.error('Error posting project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.requiredSkills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmedSkill]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header">
          <h2 className="h3 mb-0">Post a New Project</h2>

        </div>

        <div className="card-body">
          {success && (
            <div className="alert alert-success" role="alert">
              <strong>Success!</strong> Your project has been posted successfully.
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="form-control"
                    placeholder="Describe your project requirements, goals, and expectations..."
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Budget
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-control"
                    placeholder="Enter budget amount"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Duration
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-control"
                    placeholder="Estimated duration"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Required Skills</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="form-control"
                  placeholder="Add a skill (e.g., React, Python, Design)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn btn-outline-primary"
                >
                  <Plus style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>

              {formData.requiredSkills.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-primary d-flex align-items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: '0.5rem' }}
                      ></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn gradient-bg text-white"
              >
                {loading ? 'Posting Project...' : 'Post Project'}
              </button>
              <button
                type="button"
                onClick={() => onProjectPosted && onProjectPosted()}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostProject;
