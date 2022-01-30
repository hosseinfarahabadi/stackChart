import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  // class for data
  class DataRep {
    constructor(timeHappend, a, b, c, d, e) {
      this.timeHappend = timeHappend;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
    }
  }

  const [myData, setMyData] = useState([]);
  const [loading, setLoading] = useState();

  // create timer
  useEffect(() => {
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  });
  // time condition
  const tick = () => {
    const sysTime = new Date();
    const sysHours = sysTime.getHours();
    const sysMin = sysTime.getMinutes();
    const sysSec = sysTime.getSeconds();
    if (
      // sysHours >= 9 &&
      // sysHours <= 12 &&
      // (sysMin === 0 || sysMin === 30) &&
      sysSec === 0 ||
      sysSec === 20 ||
      sysSec === 40
    ) {
      console.log(sysSec);

      fetchData();
    }
  };
  // fetch data func
  const fetchData = async () => {
    setLoading(true);
    let data;
    try {
      data = await axios.get('http://new.tsetmc.com/weatherforecast');
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    calcRatio(data);
    setLoading(false);
  };

  // ratio calculation
  const calcRatio = (data1) => {
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    const pClose = data1.data.map((item) => {
      if (item.PClosingChange <= -3) {
        counter1++;
      } else if (item.PClosingChange <= -1) {
        counter2++;
      } else if (item.PClosingChange < 1) {
        counter3++;
      } else if (item.PClosingChange < 3) {
        counter4++;
      } else {
        counter5++;
      }
    });

    const sysTime = new Date();
    const sysHours = sysTime.getHours();
    const sysMin = sysTime.getMinutes();
    const sysSec = sysTime.getSeconds();
    const time = `${sysMin} ${sysSec}`;
    let data = new DataRep(
      time,
      counter1,
      counter2,
      counter3,
      counter4,
      counter5
    );

    // let tempData = myData;
    // tempData.addDataArr(data);
    // setMyData(tempData);

    myData.push(data);
    setMyData(myData);
    console.log(myData);
  };
  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;

    return toPercent(ratio, 2);
  };

  const toPercent = (decimal, fixed = 0) =>
    `${(decimal * 100).toFixed(fixed)}%`;

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);

    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total: ${total})`}</p>
        <ul className="list">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}(${getPercent(
                entry.value,
                total
              )})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      <ResponsiveContainer height={300} width="100%">
        <AreaChart
          data={myData}
          stackOffset="expand"
          margin={{ top: 20, left: -15 }}
        >
          <XAxis dataKey="timeHappend" />
          <YAxis tickFormatter={toPercent} />
          {/* <Tooltip content={renderTooltipContent} /> */}
          <Area
            type="monotone"
            dataKey="a"
            stackId="1"
            stroke="#ffffff"
            fill="#f3c363"
          />
          <Area
            type="monotone"
            dataKey="b"
            stackId="1"
            stroke="#ffffff"
            fill="#1ab394"
          />
          <Area
            type="monotone"
            dataKey="c"
            stackId="1"
            stroke="#ffffff"
            fill="#5d80f9"
          />
          <Area
            type="monotone"
            dataKey="d"
            stackId="1"
            stroke="#ffffff"
            fill="#5d80f9"
          />
          <Area
            type="monotone"
            dataKey="e"
            stackId="1"
            stroke="#ffffff"
            fill="#5d80f9"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
