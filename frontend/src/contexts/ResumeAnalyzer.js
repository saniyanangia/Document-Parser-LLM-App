import axios_gemini from 'axios';

const ResumeAnalyzer = async (resumeText, jobDescriptionText) => {
    try{
        const resumeAnalysis = await axios_gemini({
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_API_KEY}`,
            method: 'post',
            data: {
                contents: [
                    {
                        parts: [{
                            text: 
                                "Act like a skilled or very experienced ATS (Application Tracking System) with a deep understanding of the tech field. " +
                                "Your task is to evaluate the resume based on the given job description. Given the job description, find keywords not in the resume with high accuracy." +
                                "Do not hallucinate. The resume and job description are provided below." +
                                "Start the response as per the structure below: " +
                                "KeyStart 'Missing Keywords': []" +
                                "\n\n" +
                                "Provide recommendations for improvement based on the analysis. Include a section titled 'Recommendations:'." +
                                "\n\n" +
                                "This is the resume and job description to analyse: " +
                                "Resume: " + resumeText +
                                "\n\n" +
                                "Job description requirements: " + " ' " + jobDescriptionText + " ' "
                        }]
                    }
                ]
            }
        });

        // Extract response from the API response
        const responseText = resumeAnalysis.data.candidates[0].content.parts[0].text;

        const missingKeywordsRegex = /'Missing Keywords':\s*\[([^\]]*)\]/;
        const recommendationsRegex = /Recommendations:\s*([\s\S]*)/;

        // Extract MissingKeywords
        const missingKeywordsMatch = responseText.match(missingKeywordsRegex);
        let missingKeywords = [];
        if (missingKeywordsMatch) {
            const keywordsString = missingKeywordsMatch[1]
                .replace(/'/g, '')
                .split(',')
                .map(keyword => keyword.trim());
            missingKeywords = keywordsString;
        }

        // Extract Recommendations
        const recommendationsMatch = responseText.match(recommendationsRegex);
        let recommendations = recommendationsMatch ? recommendationsMatch[1].trim() : '';

        recommendations = recommendations
            .replace(/\*\*/g, '') // Replace '**' with ''
            .replace(/<\/b>\*\*/g, '') // Remove ending '**'
            .replace(/\*/g, ''); // Replace '*' with ''

        console.log("Missing Keywords:", missingKeywords);
        
        return { missingKeywords, recommendations } 
    
    } catch (error) {
        console.error("Error", error);
        throw error;
    }

}

export default ResumeAnalyzer;