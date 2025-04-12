import fetch from 'node-fetch';

// JavaScript code to fetch test set run report from PractiTest
const fetchPractiTestReport = async (apiToken, email, projectId, testSetId) => {
  try {
    // PractiTest API endpoint for test set runs
    const baseUrl = 'https://api.practitest.com/api/v2';
    const endpoint = `/projects/${projectId}/runs.json?set-ids=${testSetId}`;
    // Set up authentication and headers
    const authString = btoa(`${email}:${apiToken}`);
    
    const response = await fetch(baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'PTAPIToken': apiToken
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // const res = await response.json();
    return response.json();
  } catch (error) {
    console.error('Error fetching PractiTest report:', error);
    throw error;
  }
};

// Example usage
const apiToken = '8b8e093bea8d39e1c00af9158dfa7ade2fe5e485';
const email = 'sk185625@ncr.com';
const projectId = 26244; // Your PractiTest project ID
const testSetId = 4163145; // ID of the test set you want to fetch

// Call the function and handle the response
fetchPractiTestReport(apiToken, email, projectId, testSetId)
  .then((testRuns: any) => {
    console.log('Test runs retrieved:', testRuns);
    
    // Process the test runs data as needed
    const summary = {
      total: testRuns.length,
      passed: testRuns.filter(run => run.attributes.status === 'PASSED').length,
      failed: testRuns.filter(run => run.attributes.status === 'FAILED').length,
      blocked: testRuns.filter(run => run.attributes.status === 'NORUN').length
    };
    
    console.log('Test run summary:', summary);
  })
  .catch(error => {
    console.error('Failed to retrieve test runs:', error);
  });