import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import ResumeAnalyzer from '../contexts/ResumeAnalyzer';

const GenerateMatch = () => {
    const [resumes, setResumes] = useState([]);
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [selectedResumeName, setSelectedResumeName] = useState(null);
    const [selectedJobDescriptionTitle, setSelectedJobDescriptionTitle] = useState(null);
    const [missingKeywords, setMissingKeywords] = useState([]);
    const [recommendations, setRecommendations] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resumesResponse, jobDescriptionsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/auth/resumes'),
                    axios.get('http://localhost:8080/auth/jobs')
                ]);

                setResumes(resumesResponse.data);
                setJobDescriptions(jobDescriptionsResponse.data);

            } catch (error) {
                console.error('Error fetching resumes or job descriptions:', error);
            }
        };

        fetchData();
    }, []);

    const handleResumeSelect = (event) => {
        setSelectedResumeName(event.target.value);
        setMissingKeywords([]);
        setRecommendations('');
    };

    const handleJobDescriptionSelect = (event) => {
        setSelectedJobDescriptionTitle(event.target.value);
        setMissingKeywords([]);
        setRecommendations('');
    };

    const generateAnswer = async () => {

        if (!selectedResumeName || !selectedJobDescriptionTitle) {
            this.setState({ errorMessage: 'Please select both a resume and a job title.' });
    
            setTimeout(() => {
                this.setState({ errorMessage: '' });
            }, 5000);
    
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.get('http://localhost:8080/fetch/textdata', {
                params: {
                    fileName: selectedResumeName,
                    jobTitle: selectedJobDescriptionTitle
                }
            });

            const textdata = response.data;
            const resumeTextAll = textdata.resumeText;
            const jobDescriptionText = textdata.jobText;

            const { missingKeywords, recommendations } = await ResumeAnalyzer(resumeTextAll, jobDescriptionText);

            setMissingKeywords(missingKeywords);
            setRecommendations(recommendations);

        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An unexpected error occurred.');

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);

        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setMissingKeywords([]);
        setRecommendations('');
    };

    return (
        <>
            <section className='mb-5'>
                <div className="container">
                    <section className='mb-5'> 
                        <h1 className="mb-4">Select Resume and Job Description</h1>
                        <div>
                            <label>Select Resume:</label>
                            <select class="form-select" onChange={handleResumeSelect} value={selectedResumeName}>
                                <option value="">--Select Resume--</option>
                                {resumes.map(resume => (
                                    <option key={resume.fileName} value={resume.fileName}>{resume.fileName}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                <div>
                    <section className='mb-4'> 
                        <label>Select Job Description:</label>
                        <select class="form-select" onChange={handleJobDescriptionSelect} value={selectedJobDescriptionTitle}>
                            <option value="">--Select Job Description--</option>
                            {jobDescriptions.map(jobDesc => (
                                <option key={jobDesc.title} value={jobDesc.title}>{jobDesc.title}</option>
                            ))}
                        </select>
                    </section>
                </div>
                    <button onClick={generateAnswer} className="btn btn-primary">Generate Answer</button>
                    <button onClick={clearResults} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Clear</button>
                    {errorMessage && <p className="alert alert-danger mt-3">{errorMessage}</p>}
            </div>
            <div className="container mt-3">
                {isLoading && (
                    <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }}></div>
                    </div>
                )}
                {(missingKeywords.length > 0 || recommendations) &&
                <h1>Analysis Results</h1>}
                {missingKeywords.length > 0 && (
                    <div>
                        <strong>Missing Keywords: </strong>
                        <ul>
                            {missingKeywords.map((keyword, index) => (
                                <li key={index}>{keyword}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recommendations && (
                    <div className="recommendations-container">
                        <pre>
                            <strong>Recommendations: </strong>
                            <br />
                            {recommendations
                                .split('\n')
                                .filter(line => line.trim() !== '')
                                .map(line => line.trimStart())
                                .join('\n\n')}
                        </pre>
                    </div>
                )}
            </div>
            </section>
        </>
    );
};

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h5 className="dashboard-title"><GenerateMatch /></h5>
        </div>
    );
};

export default Dashboard;
