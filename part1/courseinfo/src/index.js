import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <h1>{course}</h1>
      {parts.map(elem =>
        <p>{elem.name} {elem.exercises}</p>)}
      <p>
        Number of exercises {parts.reduce((accum, current) => accum + current.exercises, 0)}
      </p>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
