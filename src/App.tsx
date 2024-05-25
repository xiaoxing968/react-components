import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
    return (
        <div className="App">
            <Calendar locale={'en-US'} value={dayjs(new Date())} onChange={(date) => {

            }}></Calendar>
        </div>
    );
}

export default App;
