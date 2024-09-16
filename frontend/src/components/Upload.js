import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axiosConfig';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [resumeErrorMessage, setResumeErrorMessage] = useState('');

    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobErrorMessage, setJobErrorMessage] = useState('');
    const [jobSuccessMessage, setJobSuccessMessage] = useState('');

    const [resumes, setResumes] = useState([]);
    const [jobs, setJobs] = useState([]);

    const resumeErrorTimeoutRef = useRef(null);
    const jobErrorTimeoutRef = useRef(null);
    const jobSuccessTimeoutRef = useRef(null);

    useEffect(() => {
        fetchResumes();
        fetchJobs();
    }, []);

    const handlePaste = (event) => {
        event.preventDefault();
        alert('Pasting is disabled for the job title. Please type the job title manually.');
    };

    const fetchResumes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/auth/resumes');
            setResumes(response.data);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/auth/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    };

    const onFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onFileUpload = () => {
        if (!selectedFile) {
            setResumeErrorMessage('Please select a file before uploading.');
            clearTimeout(resumeErrorTimeoutRef.current);
            resumeErrorTimeoutRef.current = setTimeout(() => setResumeErrorMessage(''), 5000);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        axios.post('http://localhost:8080/resume/upload', formData)
            .then(response => {
                setFileData({
                    name: selectedFile.name,
                    type: selectedFile.type,
                    lastModifiedDate: new Date(selectedFile.lastModifiedDate).toDateString()
                });
                setResumeErrorMessage('');
                fetchResumes(); 
            })
            .catch(error => {
                console.error('File upload failed:', error);
                if (error.response && error.response.data) {
                    setResumeErrorMessage(error.response.data.error);
                } else {
                    setResumeErrorMessage('Failed to upload file.');
                }
                clearTimeout(resumeErrorTimeoutRef.current);
                resumeErrorTimeoutRef.current = setTimeout(() => setResumeErrorMessage(''), 5000);
            });
    };

    const onJobUpload = (event) => {
        event.preventDefault();

        if (!jobTitle || !jobDescription) {
            setJobErrorMessage('Please fill in both the job title and job description.');
            clearTimeout(jobErrorTimeoutRef.current);
            jobErrorTimeoutRef.current = setTimeout(() => setJobErrorMessage(''), 5000);
            return;
        }

        const formData = new FormData();
        formData.append('jobTitle', jobTitle);
        formData.append('jobDescription', jobDescription);

        axios.post("http://localhost:8080/job/upload", formData)
            .then(() => {
                console.log("Job saved successfully");
                setJobTitle('');
                setJobDescription('');
                setJobErrorMessage('');
                setJobSuccessMessage('Job saved successfully!'); 

                clearTimeout(jobSuccessTimeoutRef.current);
                jobSuccessTimeoutRef.current = setTimeout(() => setJobSuccessMessage(''), 5000);

                fetchJobs(); 
            })
            .catch(error => {
                console.error("Job failed to save:", error);
                if (error.response && error.response.data) {
                    setJobErrorMessage(error.response.data.error);
                } else {
                    setJobErrorMessage('An unexpected error occurred.');
                }
                clearTimeout(jobErrorTimeoutRef.current);
                jobErrorTimeoutRef.current = setTimeout(() => setJobErrorMessage(''), 5000);
            });
    };

    const deleteResume = async (resumeId) => {
        try {
            await axios.delete(`http://localhost:8080/fetch/resume/${resumeId}`);
            fetchResumes(); 
        } catch (error) {
            console.error('Failed to delete resume:', error);
        }
    };

    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:8080/fetch/job/${jobId}`);
            fetchJobs(); 
        } catch (error) {
            console.error('Failed to delete job:', error);
        }
    };

    return (
        <div className='container'>
            <section className='mb-5'>
                <h1>Upload New Resume</h1>
                <div className='mb-4'>
                    <label htmlFor="formFile">Select Resume (Allowed file extensions: .docx)</label>
                    <input className="form-control" type="file" id="formFile" onChange={onFileChange} />
                    <br />
                    <button type="button" className="btn btn-primary" onClick={onFileUpload}>Upload Resume</button>
                </div>
                {fileData && (
                    <div className='mb-4'>
                        <h2>Uploaded Resume:</h2>
                        <p>File Name: {fileData.name}</p>
                        <p>File Type: {fileData.type}</p>
                        <p>Last Modified: {fileData.lastModifiedDate}</p>
                    </div>
                )}
                {resumeErrorMessage && <div className="alert alert-danger mt-3">{resumeErrorMessage}</div>}
            </section>

            <section className='mb-5'>
                <h1>Upload New Job</h1>
                <form onSubmit={onJobUpload}>
                    <div className="mb-4">
                        <label htmlFor="jobTitle" className="form-label">Job Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="jobTitle" 
                            value={jobTitle}
                            onPaste={handlePaste} 
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                        <div id="instructionsTitle" className="form-text">Please TYPE out the job title.</div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobDescription" className="form-label">Job Description</label>
                        <textarea
                            className="form-control"
                            id="jobDescription"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <div id="instructions" className="form-text">Copy and paste the full job description.</div>
                    </div>
                    <button type="submit" className="btn btn-primary">Upload Job</button>
                    {jobErrorMessage && <div className="alert alert-danger mt-3">{jobErrorMessage}</div>}
                    {jobSuccessMessage && <div className="alert alert-dismissible alert-success mt-3">{jobSuccessMessage}</div>}
                </form>
            </section>

            <section className='mb-5'>
                <h1>Your Resumes</h1>
                {resumes.length > 0 ? (
                    <ul>
                        {resumes.map(resume => (
                            <li key={resume.id}>
                                {resume.fileName}
                                <button onClick={() => deleteResume(resume.id)} className="btn btn-danger btn-sm ms-2" style={{ backgroundColor: 'brown', color: 'white' }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No resumes found.</p>
                )}
            </section>
            
            <section>
                <h1>Your Job Descriptions</h1>
                {jobs.length > 0 ? (
                    <ul>
                        {jobs.map(job => (
                            <li key={job.id}>
                                {job.title}
                                <button onClick={() => deleteJob(job.id)} className="btn btn-danger btn-sm ms-2" style={{ backgroundColor: 'brown', color: 'white' }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No job descriptions found.</p>
                )}
            </section>
        </div>
    );
}

export default Upload;
