import { useState } from "react";

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

/** ViewVotes returns a component that displays "has N votes"; if only one vote then votes => vote */
const ViewVotes = ({voteCount}) => {
  if (voteCount === 1) {
    return (
      <div>has 1 vote</div>
    )
  }

  return (
    <div>has {voteCount} votes</div>
  )
}

/** BestAnecdote checks between a list of anecdotes and list of votes
 * and prints out which has the highest number of votes.
*/
const BestAnecdote = ({anecdotes, votes}) => {
  /** @type {{anecdote: string, voteCount: number}} */
  const topVoted = anecdotes.reduce(
    (acc, cur, idx) => {
      if (votes[idx] > acc.voteCount) {
        return {anecdote: cur, voteCount: votes[idx]}
      }
      return acc
    },
    {anecdote: anecdotes[0], voteCount: 0}
  )

  return (
    <div>
      <div>{topVoted.anecdote}</div>
      <ViewVotes voteCount={topVoted.voteCount} />
    </div>
  )
}

const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(anecdotes.map(_ => 0))

  /** chooseRandom changes selected to be between 0 to len(anecdotes)-1 */
  const chooseRandom = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  /** vote votes for selected */
  const vote = () => {
    const copy = [...votes]
    copy[selected]++
    setVotes(copy)
  }

  return (
    <div>
      <div id='main-anecdote'>
        <h1>Anecdote of the day</h1>
        <div>{anecdotes[selected]}</div>
        <ViewVotes voteCount={votes[selected]} />
        <Button onClick={vote} text='vote' />
        <Button onClick={chooseRandom} text='next anecdote' />
      </div>

      <div id='best-anecdote'>
        <h1>Anecdote with most votes</h1>
        <BestAnecdote anecdotes={anecdotes} votes={votes} />
      </div>
    </div>
  )
}

export default App;
