import api from './api';

const jobService = {
    /**
     * Get status of a background job
     * @param {string} jobId - Job ID
     * @returns {Promise} Job status object
     */
    getJobStatus: async (jobId) => {
        return api.get(`/jobs/${jobId}`);
    },

    /**
     * Poll job status until completion or failure
     * @param {string} jobId - Job ID
     * @param {Function} onUpdate - Callback function called on each update (state, result, error)
     * @param {number} interval - Polling interval in milliseconds (default: 1000)
     * @returns {Function} Stop polling function
     */
    pollJobStatus: async (jobId, onUpdate, interval = 1000) => {
        let polling = true;
        let timeoutId;

        const poll = async () => {
            if (!polling) return;

            try {
                const response = await jobService.getJobStatus(jobId);
                const { state, result, error } = response.data;

                // Call update callback
                if (onUpdate) {
                    onUpdate({ state, result, error });
                }

                // Check if job is complete
                if (state === 'completed' || state === 'failed') {
                    polling = false;
                    return;
                }

                // Schedule next poll
                if (polling) {
                    timeoutId = setTimeout(poll, interval);
                }
            } catch (err) {
                console.error('Error polling job status:', err);

                // Call error callback
                if (onUpdate) {
                    onUpdate({ state: 'error', error: err.message || 'Failed to check job status' });
                }

                // Continue polling unless it's a 404 (job not found)
                if (err.response?.status !== 404 && polling) {
                    timeoutId = setTimeout(poll, interval);
                } else {
                    polling = false;
                }
            }
        };

        // Start polling
        poll();

        // Return function to stop polling
        return () => {
            polling = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    },
};

export default jobService;
