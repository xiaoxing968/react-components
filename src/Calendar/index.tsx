import dayjs, {Dayjs} from "dayjs";
import {CSSProperties, ReactNode, useState} from "react";
import cs from 'classnames'
import './index.scss';
import MonthCalendar from "./MonthCalendar";
import Header from "./Header";
import LocaleContext from "./LocaleContext";

export interface CalendarProps {
    value: Dayjs,
    style?: CSSProperties;
    className?: string | string[];
    // 定制日期显示，会完全覆盖日期单元格
    dateRender?: (currentDate: Dayjs) => ReactNode;
    // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
    dateInnerContent?: (currentDate: Dayjs) => ReactNode;
    // 国际化相关
    locale?: string;
    onChange?: (date: Dayjs) => void;
}


function Calendar(props: CalendarProps) {

    const {
        value,
        style,
        className,
        locale,
        onChange
    } = props;
    // 当前日期
    const [curValue, setCurValue] = useState<Dayjs>(value);
    // 当前月
    const [curMonth, setCurMonth] = useState<Dayjs>(value);

    const classNames = cs("calendar", className);

    function changeDate(date: Dayjs) {
        setCurValue(date);
        setCurValue(date);
        onChange?.(date);
    }
    // 点击日期事件
    function selectHandler(date: Dayjs) {
        changeDate(date);
    }
    // 点击上个月
    function prevMonthHandler() {
        setCurMonth(curMonth.subtract(1, 'month'));
    }
    // 点击下个月
    function nextMonthHandler() {
        setCurMonth(curMonth.add(1, 'month'));
    }
    // 点击今天
    function todayHandler() {
        const date = dayjs(Date.now());
        changeDate(date);
    }


    return <LocaleContext.Provider value={{
        /* 没设置日期则从浏览器获取默认日期 */
        locale: locale || navigator.language
    }}>
        <div className={classNames} style={style}>
            <Header
                curMonth={curMonth}
                prevMonthHandler={prevMonthHandler}
                nextMonthHandler={nextMonthHandler}
                todayHandler={todayHandler}></Header>
            <MonthCalendar {...props} value={curValue} curMonth={curMonth} selectHandler={selectHandler}/>
        </div>
    </LocaleContext.Provider>
}


export default Calendar;
