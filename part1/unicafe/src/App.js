import { useState } from "react";

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

// Statistic displays a single statistic
const Statistic = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

// Statistics takes statistics of good, neutral, and bad orders and displays details about them
const Statistics = ({good, neutral, bad}) => {
  const total = good+neutral+bad
  if (total === 0) {
    return (
      <div id='stats'>
        No feedback given
      </div>
    )
  }
  const average = (good-bad)/total

  return (
    <table id='stats'>
      <tbody>
        <Statistic text='good' value={good} />
        <Statistic text='neutral' value={neutral} />
        <Statistic text='bad' value={bad} />
        <Statistic text='all' value={total} />
        <Statistic text='average' value={average} />
        <Statistic text='positive' value={100*good/total + '%'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div id='feedback-buttons'>
        <Button onClick={() => setGood(good+1)} text='good' />
        <Button onClick={() => setNeutral(neutral+1)} text='neutral' />
        <Button onClick={() => setBad(bad+1)} text='bad' />
      </div>
      
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
