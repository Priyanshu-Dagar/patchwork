document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('heatmap');
    if (!container) return;

    fetch('/skills/heatmap')
        .then(res => res.json())
        .then(skills => {
            if (skills.length === 0) {
                container.innerHTML = '<p>No skill data available.</p>';
                return;
            }
            skills.forEach(skill => {
                const intensity = Math.min(255, 50 + skill.count * 40);
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.style.backgroundColor = `rgb(0, ${intensity}, 150)`;
                cell.innerHTML = `
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-count">${skill.count} Teachers</span>
                `;
                cell.title = `${skill.name}: ${skill.count} teachers in ${skill.category}`;
                container.appendChild(cell);
            });
        })
        .catch(err => console.error('Error fetching heatmap:', err));
});
