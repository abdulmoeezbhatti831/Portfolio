let DEFAULT_PROJECTS = [
  {
    type: 'CRM systems',
    title: 'From lead capture to closed loop.',
    description: 'CRM workflows and Deluge automation that keep records useful, follow-ups timely, and teams aligned.',
    link: 'https://www.upwork.com/freelancers/~016e9081f4be32f84?p=2093971224366964736',
    skills: ['Zoho CRM', 'Deluge', 'Workflows']
  },
  {
    type: 'AI automation',
    title: 'Less manual work. More momentum.',
    description: 'Multi-step automations that connect AI services, business logic, and notifications into a dependable operating rhythm.',
    link: 'https://www.upwork.com/freelancers/~016e9081f4be32f84?p=2093965981694865408',
    skills: ['n8n', 'AI', 'Webhooks']
  },
  {
    type: 'API integrations',
    title: 'Make every tool speak clearly.',
    description: 'Reliable data exchange between CRMs and external systems through clean API design, JSON, and webhooks.',
    link: 'https://www.upwork.com/freelancers/~016e9081f4be32f84?p=2079493673282576384',
    skills: ['REST APIs', 'JSON', 'Webhooks']
  },
  {
    type: 'Process automation',
    title: 'Replace handoffs with systems.',
    description: 'End-to-end business process automations that reduce repetitive tasks and make operations easier to manage.',
    link: 'https://www.upwork.com/freelancers/~016e9081f4be32f84?p=2068720182072082432',
    skills: ['n8n', 'Zapier', 'Zoho']
  }
];

const PROJECTS_DATA_READY = loadProjectsData();

async function loadProjectsData() {
  try {
    const response = await fetch('projects.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load projects.json');
    const projects = await response.json();
    if (Array.isArray(projects)) DEFAULT_PROJECTS = projects;
  } catch (error) {
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, function (char) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return map[char] || char;
  });
}

function normaliseProjects(projects) {
  if (!Array.isArray(projects)) {
    return DEFAULT_PROJECTS.map(function (project) {
      return {
        type: project.type,
        title: project.title,
        description: project.description,
        link: project.link,
        skills: Array.isArray(project.skills) ? project.skills.slice() : []
      };
    });
  }

  return projects.map(function (project) {
    return {
      type: String(project.type || ''),
      title: String(project.title || ''),
      description: String(project.description || ''),
      link: String(project.link || ''),
      skills: Array.isArray(project.skills)
        ? project.skills.map(function (skill) { return String(skill || '').trim(); }).filter(Boolean)
        : []
    };
  });
}

function getProjects() {
  return normaliseProjects(DEFAULT_PROJECTS);
}

function saveProjects(projects) {
  DEFAULT_PROJECTS = normaliseProjects(projects);
}

function downloadProjectsFile(projects) {
  const file = new Blob([JSON.stringify(normaliseProjects(projects), null, 2) + '\n'], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'projects.json';
  link.click();
  URL.revokeObjectURL(url);
}

function getProjectMarkup(project) {
  return `
    <article class="project">
      <div>
        <div class="project-type mono">${escapeHtml(project.type || 'Project')}</div>
        <h3>${escapeHtml(project.title || 'Untitled project')}</h3>
        <p>${escapeHtml(project.description || '')}</p>
        <div class="tags">
          ${(project.skills || []).map(function (skill) {
            return '<span class="tag">' + escapeHtml(skill) + '</span>';
          }).join('') || '<span class="tag">Add skills</span>'}
        </div>
      </div>
      ${project.link ? `<a class="project-link" href="${project.link}" target="_blank" rel="noopener noreferrer">View project on Upwork <span class="arrow">↗</span></a>` : ''}
    </article>
  `;
}
