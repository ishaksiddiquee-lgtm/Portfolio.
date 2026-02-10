const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the current directory

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with default data
        const defaultData = {
            identity: {
                name: 'Ishaq Siddique Akbar',
                title: 'Creative Developer',
                bio: 'My name is Ishaq Siddique Akbar. I am a passionate and dedicated web developer with a strong interest in building modern, user-friendly, and responsive websites. I have experience working with HTML, CSS, JavaScript, and modern web technologies. I enjoy learning new tools and frameworks and continuously improving my development skills. My goal is to create high-quality digital solutions that solve real-world problems and provide a great user experience.',
                email: 'hello@example.com',
                phone: '+1 (555) 123-4567',
                location: 'Karachi, Pakistan'
            },
            projects: []
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// GET endpoint to retrieve all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// PUT endpoint to update identity information
app.put('/api/identity', async (req, res) => {
    try {
        const currentData = await fs.readFile(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(currentData);

        // Update identity information
        parsedData.identity = { ...parsedData.identity, ...req.body };

        await fs.writeFile(DATA_FILE, JSON.stringify(parsedData, null, 2));
        res.json({ success: true, data: parsedData.identity });
    } catch (error) {
        console.error('Error updating identity:', error);
        res.status(500).json({ error: 'Failed to update identity' });
    }
});

// POST endpoint to add a new project
app.post('/api/projects', async (req, res) => {
    try {
        const currentData = await fs.readFile(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(currentData);

        // Add new project with a unique ID
        const newProject = {
            id: Date.now(),
            ...req.body
        };

        parsedData.projects.push(newProject);

        await fs.writeFile(DATA_FILE, JSON.stringify(parsedData, null, 2));
        res.json({ success: true, project: newProject });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
});

// PUT endpoint to update an existing project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const currentData = await fs.readFile(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(currentData);

        const projectId = parseInt(req.params.id);
        const projectIndex = parsedData.projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update the project
        parsedData.projects[projectIndex] = { ...parsedData.projects[projectIndex], ...req.body };

        await fs.writeFile(DATA_FILE, JSON.stringify(parsedData, null, 2));
        res.json({ success: true, project: parsedData.projects[projectIndex] });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE endpoint to remove a project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const currentData = await fs.readFile(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(currentData);

        const projectId = parseInt(req.params.id);
        const projectIndex = parsedData.projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Remove the project
        parsedData.projects.splice(projectIndex, 1);

        await fs.writeFile(DATA_FILE, JSON.stringify(parsedData, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Initialize data file and start server
initializeDataFile()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Data file: ${DATA_FILE}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize server:', error);
    });

module.exports = app;