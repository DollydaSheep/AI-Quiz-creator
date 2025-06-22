const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const {spawn} = require('child_process');
const fs = require('fs');

const port = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
    destination: './', // Directory to save uploaded files
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

function getResult(py){
    return new Promise((resolve,reject)=>{
        let resultdata='';

        py.stdout.on('data', (data)=>{
            resultdata += data.toString();
        });
        py.stdout.on('end',()=>{
            const parsed = JSON.parse(resultdata);
            resolve(parsed.result);
        })
    })
}

app.post('/prompt',upload.single('pdfFile'),async (req,res) => {

    
    if(req.file){
        console.log(req.file.filename);
    }

    const py = spawn('python',['extract.py', JSON.stringify({path: req.file.filename})])

    let prompt = await getResult(py)
    

    prompt += `make a quiz of 5 items each with 4 abcd choices, surround each choices with / and surround the questions with =. For example: =question question question= /a. answer/ 
    /b. answer/ 
    /c. answer/ 
    /d. answer/`;
    prompt += `list in a different line the correct answers as index and surround it with + for example
    +1+
    +0+
    +2+
    +3+
    +1+
    the numbers represent the letters of the answers (0 for a, 1 for b, etc)`

    console.log(prompt);

    fs.unlink(req.file.filename,(err)=>{
        if(err) throw err;
        console.log("file deleted");
    })

    fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1-0528:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                    }
                ]
            })
        })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log(data.choices[0].message.content);
        const text = data.choices[0].message.content;
        let questions = [];
        let answerOpt = [];
        let correctAnswer = [];
        let lines = text.split('\n');
        
        let answerGroup = [];
        let count = 0;

        lines.forEach(line => {
            if(/^=.*=$/.test(line.trim())){
                questions.push(line.trim().slice(1,-1));
            }
            
            if (/^\/.*\/$/.test(line.trim())){
                answerGroup.push(line.trim().slice(1,-1));
                count++;
                if(count==4){
                    answerOpt.push(answerGroup);
                    answerGroup = [];
                    count = 0;
                }
            }

            if (/^\+.*\+$/.test(line.trim())){
                correctAnswer.push(parseInt(line.trim().slice(1,-1)));
            }
        });
        console.log(data);
        res.status(200).json({
            questions: questions,
            answerOpt: answerOpt,
            correctAnswer: correctAnswer
        })
    })
    .catch(err => {
        console.error(err);

    })
})

const server = app.listen(port, ()=>{
    console.log("server is running on port 3000");
})