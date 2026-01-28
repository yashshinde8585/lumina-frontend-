// Tour Guide Utility for Lumina
export const startTour = () => {
    Promise.all([
        import('driver.js'),
        import('driver.js/dist/driver.css')
    ]).then(([{ driver }]) => {
        const tour = driver({
            showProgress: true,
            steps: [
                { element: '#app-logo', popover: { title: 'Welcome to Lumina', description: 'Track job applications, manage resumes, and optimize your job search journey.' } },
                { element: '#create-new-resume-btn', popover: { title: 'Import Application', description: 'Add jobs you\'ve applied to and attach your resume to track them.' } },
                { element: '#dashboard-analytics', popover: { title: 'Analytics Dashboard', description: 'View your application metrics, success rates, and conversion funnel.' } },
                { element: '#dashboard-job-board', popover: { title: 'Job Tracker Board', description: 'Drag and drop job cards across stages to track your application progress.' } },
                { element: '#user-profile-menu', popover: { title: 'Your Profile', description: 'Access your account settings, resumes, and preferences.' } },
            ]
        });
        tour.drive();
    }).catch(err => {
        console.error('Failed to load tour:', err);
    });
};
