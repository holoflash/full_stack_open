import { useState } from 'react'

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}:</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ statistics, all, average, positive }) => {
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={statistics.good} />
        <StatisticsLine text="neutral" value={statistics.neutral} />
        <StatisticsLine text="bad" value={statistics.bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={positive + "%"} />
      </tbody>
    </table>
  )
}

const Button = ({ type, statistics, setStatistics }) => {
  const handleClick = () => {
    setStatistics({ ...statistics, [type]: statistics[type] + 1 })
  }
  return (
    <button onClick={handleClick}>{type}</button>
  )
}
const App = () => {
  const [statistics, setStatistics] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  });

  const all = statistics.good + statistics.neutral + statistics.bad;
  const average = all ? ((statistics.good * 1) + (statistics.neutral * 0) + (statistics.bad * -1)) / all : 0;
  const positive = all ? (statistics.good / all) * 100 : 0;

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button type={"good"} {...{ statistics, setStatistics }} />
        <Button type={"neutral"} {...{ statistics, setStatistics }} />
        <Button type={"bad"} {...{ statistics, setStatistics }} />
      </div>
      <h1>statistics</h1>
      {all > 0 ? (
        <Statistics {...{ statistics, all, average, positive }} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  )
}

export default App