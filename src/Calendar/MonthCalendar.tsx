import {CalendarProps} from "./index";
import {Dayjs} from "dayjs";
import cs from 'classnames'
import {useContext} from "react";
import LocaleContext from "./LocaleContext";
import allLocales from "./locale";
interface MonthCalendarProps extends CalendarProps {
    curMonth: Dayjs, // 当前月份
    selectHandler?: (date: Dayjs) => void // 选择日期的回调
}
function getAllDays(date: Dayjs) {
    const daysInMonth = date.daysInMonth() // 获取当前月份的天数
    const startDate = date.startOf('month') // 获取当前月份第一天的时间对象
    const day = startDate.day() // 获取当前月份第一天是星期几


    // 创建一个数组，一行固定为7天，所以长度为6*7，用于存储当前月份的所有日期信息
    const daysInfo: Array<{date: Dayjs, currentMonth: boolean}> = new Array(6 * 7);
    for(let i = 0 ; i < day; i++) {
        daysInfo[i] = {
            // 获取本月第一天的前{day}天 填充到数组前面
            date: startDate.subtract(day - i, 'day'),
            currentMonth: false,
        }
    }
    for(let i = day ; i < daysInfo.length; i++) {
        const calcDate = startDate.add(i - day, 'day');
        daysInfo[i] = {
            // 填充本月
            date: calcDate,
            currentMonth: calcDate.month() === date.month()
        }
    }
    return daysInfo
}




function MonthCalendar(props: MonthCalendarProps) {
    const localeContext = useContext(LocaleContext)
    const { value, curMonth , dateRender, dateInnerContent, selectHandler } = props
    const CalendarLocale = allLocales[localeContext.locale];

    const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const allDays = getAllDays(curMonth);
    function renderDays(days: Array<{ date: Dayjs, currentMonth: boolean}>) {
        const rows = [];
        for (let i = 0; i < 6; i++) {
            const row = [];
            for (let j = 0; j < 7; j++) {
                const item = days[i * 7 + j];
                row[j] = <div
                    className={"calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')}
                    onClick={() => selectHandler?.(item.date)}
                >
                    {
                        dateRender ? dateRender(item.date) : (
                            <div className="calendar-month-body-cell-date">
                                <div className={
                                    cs("calendar-month-body-cell-date-value",
                                        value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                                            ? "calendar-month-body-cell-date-selected"
                                            : ""
                                    )
                                }>{item.date.date()}</div>
                                {/*日期下自定义内容*/}
                                <div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
                            </div>
                        )
                    }
                </div>
            }
            rows.push(row);
        }
        return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
    }

    return (
        <div className="calendar-month">
            <div className="calendar-month-week-list">
                {
                    weekList.map((week) => (
                        <div className="calendar-month-week-list-item" key={week}>
                            {CalendarLocale.week[week]}
                        </div>
                    ))
                }
            </div>
            <div className="calendar-month-body">
                {
                    renderDays(allDays)
                }
            </div>
        </div>
    )
}

export default MonthCalendar