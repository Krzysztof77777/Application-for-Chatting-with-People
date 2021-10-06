import React, { useContext } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";
import MessageFromRight from "./MessageFromRight.jsx";
import MessageFromLeft from "./MessageFromLeft.jsx";

const daysInWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Message = ({
  e,
  day,
  month,
  hour,
  minutes,
  dayInMonth,
  dayInWeek,
  addDivider,
}) => {
  const { ourObjectID } = useContext(StoreContext);
  let content;
  if (addDivider) {
    content = (
      <div className="divider">
        <span></span>
        <p>
          {daysInWeek[dayInWeek]}, {month < 10 ? "0" + month : month}-
          {dayInMonth < 10 ? "0" + dayInMonth : dayInMonth}
        </p>
      </div>
    );
  }
  if (e.message.from.ObjectID === ourObjectID) {
    return (
      <>
        {content}
        <MessageFromRight
          element={e}
          day={day}
          month={month}
          hour={hour}
          minutes={minutes}
        ></MessageFromRight>
      </>
    );
  }
  return (
    <>
      {content}
      <MessageFromLeft
        element={e}
        day={day}
        month={month}
        hour={hour}
        minutes={minutes}
      ></MessageFromLeft>
    </>
  );
};

export default Message;
