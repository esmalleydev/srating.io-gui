import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine, LineProps, ReferenceLineProps, YAxisProps } from 'recharts';


import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';


const Chart = (
  {rows, lines, referenceLines, YAxisProps, XAxisDataKey, YAxisLabel}:
  {rows: any[], lines: LineProps[], referenceLines?: ReferenceLineProps[], YAxisProps: YAxisProps, XAxisDataKey: string, YAxisLabel: string}
) => {
  
  const theme = useTheme();

  /*
  const CustomLegend = ({ payload }: { payload: Payload[]}) => {
    const onClick = (dataKey) => {
      if (inactiveSeries.includes(dataKey)) {
        setInactiveSeries(inactiveSeries.filter(el => el !== dataKey));
      } else {
        setInactiveSeries(prev => [...prev, dataKey]);
      }
    };

    return (
      <div style = {{'marginLeft': 10}}>
        {
          payload.map((entry, index) => {
            const color = entry.dataKey && inactiveSeries.includes(entry.dataKey as string) ? theme.palette.grey[500] : entry.color;
            return (
              <div key={`item-${index}`} style = {{'display': 'flex', alignItems: 'center', margin: '5px 0px', 'cursor': 'pointer'}} onClick={() => {onClick(entry.dataKey)}}>
                <div style = {{display: 'flex'}}>
                  <LinearScaleIcon style = {{'fontSize': '14px', color: color}} />
                </div>
                <div style = {{display: 'flex', marginLeft: 5}}>
                  <Typography variant='caption' color = {color}>{entry.value}</Typography>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  };
  */


  type TooltipProps = {
    active?: boolean;
    payload?: { value: number, name: string, stroke: string, payload: any}[];
    label?: number;
  };
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} style = {{'padding': '5px 10px'}}>
          <div><Typography color = 'text.secondary' variant='subtitle2'>{payload[0].payload?.[XAxisDataKey] || label}</Typography></div>
          {
            payload.map((entry, index) => {
              return (
                <div key = {index} style = {{'display': 'flex'}}><Typography variant='body1' color = {entry.stroke} >{entry.name}:</Typography><Typography style = {{'marginLeft': 5}} variant='body1' color = {entry.stroke}>{entry.value}</Typography></div>
              );
            })
          }
        </Paper>
      );
    }
    
    return null;
  };



  return (
    <div style = {{'display': 'flex', 'height': 300, 'padding': '0px 5px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{
            right: 10,
          }}
        >
          <CartesianGrid strokeDasharray = '3 3' />
          <XAxis dataKey = {XAxisDataKey} minTickGap={20} tickLine = {false} axisLine = {false} type='category' /*interval={'preserveStartEnd'}*/ />
          <YAxis {...YAxisProps}>
            <Label offset={10} value={YAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: theme.palette.info.main, fontSize: 18 }} />
          </YAxis>
          {
            referenceLines ? 
            referenceLines.map((referenceLine, index) => {
              // {..referenceLine} spread doesnt work for some reason... I guess if you add a prop then add it here too >.<
              <ReferenceLine key = {index} x = {referenceLine.x} stroke = {referenceLine.stroke} label = {referenceLine.label} />
            }) :
            ''
          }
          <Legend layout='horizontal' align='center' verticalAlign='bottom' margin = {{top: 0, left: 10, right: 0, bottom: 0}} /*content={CustomLegend}*/ />
          <Tooltip cursor = {{stroke: theme.palette.warning.main, strokeWidth: 2}} content={<CustomTooltip />} />
          {
            lines.map((line, index) => {
              // {..line} spread doesnt work for some reason... I guess if you add a prop then add it here too >.<
              return (
                <Line key = {index} type={line.type} name={line.name} dataKey={line.dataKey} stroke={line.stroke} strokeWidth={line.strokeWidth} dot={line.dot} connectNulls={line.connectNulls}  />
              );
            })
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
