import React from 'react'

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((accum, current) => accum + current.exercises, 0)
  let exercises = 'exercises'
  if (sum === 1) {
    exercises = 'exercise'
  }

  return (
    <p>
      <strong>total of {sum} {exercises}</strong>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      {course.parts.map(part => <Part key={part.id} part={part} />)}
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
