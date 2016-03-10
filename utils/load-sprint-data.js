export default function loadSprintData(sprintNumber) {
    const sprint = fetch(`/sprints/${sprintNumber}/sprint.json`).then((res) => res.json());
    const data = fetch(`/sprints/${sprintNumber}/data.json`).then((res) => res.json());

    return Promise.all([sprint, data]).then(([sprint, data]) => {
        return {
            number: sprintNumber,
            sprint,
            data
        };
    });
}
