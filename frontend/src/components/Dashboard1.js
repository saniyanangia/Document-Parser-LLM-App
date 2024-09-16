// import React, { Component } from 'react';
// import axios from '../api/axiosConfig';
// import ResumeAnalyzer from '../contexts/ResumeAnalyzer';

// class GenerateMatch extends Component {
//     state = {
//         resumes: [],
//         jobDescriptions: [],
//         selectedResumeName: null,
//         selectedJobDescriptionTitle: null,
//         missingKeywords: [],
//         recommendations: '',
//         errorMessage: '',
//         isLoading: false
//     };

//     async componentDidMount() {
//         try {
//             const [resumesResponse, jobDescriptionsResponse] = await Promise.all([
//                 axios.get('http://localhost:8080/auth/resumes'),
//                 axios.get('http://localhost:8080/auth/jobs')
//             ]);

//             this.setState({
//                 resumes: resumesResponse.data,
//                 jobDescriptions: jobDescriptionsResponse.data
//             });
//         } catch (error) {
//             console.error('Error fetching resumes or job descriptions:', error);
//         }
//     }

//     handleResumeSelect = (event) => {
//         this.setState({ 
//             selectedResumeName: event.target.value,
//             missingKeywords: [],
//             recommendations: ''
//         });
//     };

//     handleJobDescriptionSelect = (event) => {
//         this.setState({ 
//             selectedJobDescriptionTitle: event.target.value,
//             missingKeywords: [],
//             recommendations: ''
//         });
//     };

//     generateAnswer = async () => {
//         const { selectedResumeName, selectedJobDescriptionTitle } = this.state;

//         if (!selectedResumeName || !selectedJobDescriptionTitle) {
//             this.setState({ errorMessage: 'Please select both a resume and a job title.' });
    
//             setTimeout(() => {
//                 this.setState({ errorMessage: '' });
//             }, 5000);
    
//             return;
//         }
        
//         this.setState({ isLoading: true });

//         try {
//             const response = await axios.get('http://localhost:8080/fetch/textdata', {
//                 params: {
//                     fileName: selectedResumeName,
//                     jobTitle: selectedJobDescriptionTitle
//                 }
//             });

//             const textdata = response.data;
//             const resumeTextAll = textdata.resumeText;
//             const jobDescriptionText = textdata.jobText;

//             const { missingKeywords, recommendations } = await ResumeAnalyzer(resumeTextAll, jobDescriptionText);
                
//             this.setState({ 
//                 missingKeywords,
//                 recommendations
//             });
//         }
        
//         catch (error) {
//             console.error('An error occurred:', error);
//             this.setState({ errorMessage: 'An unexpected error occurred.' });
//             setTimeout(() => {
//                 this.setState({ errorMessage: '' });
//             }, 5000);
            
//         } finally {
//             this.setState({ isLoading: false });
//         }
//     };

//     clearResults = () => {
//         this.setState({ 
//             missingKeywords: [],
//             recommendations: ''
//         });
//     };

//     render() {
//         return (
//             <>
//                 <section className='mb-5'>
//                     <div className="container">
//                         <section className='mb-5'> 
//                             <h1 className="mb-4">Select Resume and Job Description</h1>
//                             <div>
//                                 <label>Select Resume:</label>
//                                 <select class="form-select" onChange={this.handleResumeSelect} value={this.state.selectedResumeName}>
//                                     <option value="">--Select Resume--</option>
//                                     {this.state.resumes.map(resume => (
//                                         <option key={resume.fileName} value={resume.fileName}>{resume.fileName}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </section>

//                     <div>
//                         <section className='mb-4'> 
//                             <label>Select Job Description:</label>
//                             <select class="form-select" onChange={this.handleJobDescriptionSelect} value={this.state.selectedJobDescriptionTitle}>
//                                 <option value="">--Select Job Description--</option>
//                                 {this.state.jobDescriptions.map(jobDesc => (
//                                     <option key={jobDesc.title} value={jobDesc.title}>{jobDesc.title}</option>
//                                 ))}
//                             </select>
//                         </section>
//                     </div>
//                         <button onClick={this.generateAnswer} className="btn btn-primary">Generate Answer</button>
//                         <button onClick={this.clearResults} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Clear</button>
//                         {this.state.errorMessage && <p className="alert alert-danger mt-3">{this.state.errorMessage}</p>}
//                 </div>
//                 <div className="container mt-3">
//                     {this.state.isLoading && (
//                         <div className="progress">
//                             <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }}></div>
//                         </div>
//                     )}
//                     {(this.state.missingKeywords.length > 0 || this.state.recommendations) &&
//                     <h1>Analysis Results</h1>}
//                     {this.state.missingKeywords.length > 0 && (
//                         <div>
//                             <strong>Missing Keywords: </strong>
//                             <ul>
//                                 {this.state.missingKeywords.map((keyword, index) => (
//                                     <li key={index}>{keyword}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
    
//                     {this.state.recommendations && (
//                         <div className="recommendations-container">
//                             <pre>
//                                 <strong>Recommendations: </strong>
//                                 <br />
//                                 {this.state.recommendations
//                                     .split('\n')
//                                     .filter(line => line.trim() !== '')
//                                     .map(line => line.trimStart())
//                                     .join('\n\n')}
//                             </pre>
//                         </div>
//                     )}
//                 </div>
//                 </section>
//             </>
//         );
//     }
// };

// class Dashboard extends Component {
//     render() {
//         return (
//             <>
//                 <div className="dashboard-container">
//                     <h5 className="dashboard-title"><GenerateMatch /></h5>
//                 </div>
//             </>
//         );
//     }
// }

// export default Dashboard;