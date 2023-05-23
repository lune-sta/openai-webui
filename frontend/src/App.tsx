import React from "react";
import './App.css'
import ButtonAppBar from "./BottonAppBar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


function App() {
    const [question, setQuestion] = React.useState("")
    const [answer, setAnswer] = React.useState("")

    const postQuestion = (question: string) => {
        const form = new FormData();
        form.append('message', question);

        fetch('http://localhost:5000/messages', {method: 'POST', body: form})
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setAnswer(data['answer'])
            })
    }

  return (
      <div>
        <ButtonAppBar
        ></ButtonAppBar>

          <p>{answer}</p>
          <TextField
              id="outlined-multiline-flexible"
              label="Multiline"
              multiline
              maxRows={4}
              value={question}
              style={{marginTop: '5em'}}
              onChange={(e) => setQuestion(e.target.value)}
          />
          <Button onClick={() => postQuestion(question)}>おくる</Button>
      </div>
  )
}

export default App
