import React, { useState } from 'react';
import { X, ExternalLink, Code2, Cpu, Zap } from 'lucide-react';
import type { Project } from '../types';
import './ProjectDetailsModal.css';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'role'>('overview');

  return (
    <div className="modal-backdrop" id="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal"
        id="project-modal"
        style={{ '--accent': project.color } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-accent-dot" style={{ background: project.color, boxShadow: `0 0 12px ${project.color}` }} />
            <div>
              <h1 className="modal-project-name">{project.name}</h1>
              <p className="modal-project-subtitle">{project.description.slice(0, 80)}...</p>
            </div>
          </div>
          <button className="modal-close-btn" id="project-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tech Tags */}
        <div className="modal-tech-tags">
          {project.tech.map((t) => (
            <span key={t} className="tech-tag" style={{ borderColor: project.color, color: project.color }}>
              {t}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="modal-tabs" role="tablist">
          {(['overview', 'features', 'role'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              className={`modal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && <Zap size={12} />}
              {tab === 'features' && <Cpu size={12} />}
              {tab === 'role' && <Code2 size={12} />}
              {tab === 'role' ? 'My Role' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="tab-panel" id="tab-panel-overview">
              <p className="modal-description">{project.description}</p>
              <div className="modal-visual-bar">
                {project.tech.map((_, i) => (
                  <div
                    key={i}
                    className="visual-bar-segment"
                    style={{
                      background: project.color,
                      opacity: 0.3 + (i / project.tech.length) * 0.7,
                      flex: 1,
                    }}
                  />
                ))}
              </div>
              <p className="modal-tech-label">Tech Stack Diversity</p>
            </div>
          )}

          {activeTab === 'features' && (
            <ul className="modal-features-list" id="tab-panel-features">
              {project.features.map((f, i) => (
                <li key={i} className="feature-item">
                  <span className="feature-bullet" style={{ color: project.color }}>◆</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'role' && (
            <div className="tab-panel" id="tab-panel-role">
              <p className="modal-description">{project.role}</p>
              {project.challenges && (
                <>
                  <p className="modal-tech-label" style={{ marginTop: '16px', marginBottom: '8px' }}>KEY CHALLENGE</p>
                  <p className="modal-description">{project.challenges}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-btn primary-btn"
            id={`btn-demo-${project.id}`}
            style={{ background: project.color, boxShadow: `0 0 18px ${project.color}55` }}
          >
            <ExternalLink size={14} /> Live Demo
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-btn secondary-btn"
            id={`btn-github-${project.id}`}
            style={{ borderColor: project.color, color: project.color }}
          >
          <Code2 size={14} /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
