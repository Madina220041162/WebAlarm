// Calendar page - displays calendar view
export default function Calendar() {
  const currentDate = new Date()

  return (
    <div>
      <h1>Calendar</h1>
      <p>Current date: {currentDate.toDateString()}</p>
      <p>Calendar view will be implemented here.</p>
    </div>
  )
}