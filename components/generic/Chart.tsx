'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine, LineProps, ReferenceLineProps, YAxisProps,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultLegendContent';

import { useState } from 'react';

import LinearScaleIcon from '@mui/icons-material/LinearScale';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';
import RankSpan from './RankSpan';


/**
 * Normalized chart display.
 * If you pass in rankMax it will attempt to add Rankspan to tooltip if the Line has a unit = 'rank'
 *
 */
const Chart = (
  { rows, lines, referenceLines, YAxisProps, XAxisDataKey, YAxisLabel, rankMax = 0 }:
  { rows: object[], lines: LineProps[], referenceLines?: ReferenceLineProps[], YAxisProps: YAxisProps, XAxisDataKey: string, YAxisLabel: string, rankMax?: number },
) => {
  const theme = useTheme();

  const [inactiveSeries, setInactiveSeries] = useState<Array<string>>([]);

  const CustomLegend = ({ payload }: { payload: Payload[]}) => {
    const onClick = (dataKey) => {
      if (inactiveSeries.includes(dataKey)) {
        setInactiveSeries(inactiveSeries.filter((el) => el !== dataKey));
      } else {
        setInactiveSeries((prev) => [...prev, dataKey]);
      }
    };

    return (
      <div style = {{ marginLeft: 10 }}>
        {
          payload.map((entry, index) => {
            const color = entry.dataKey && inactiveSeries.includes(entry.dataKey as string) ? theme.grey[500] : entry.color;
            return (
              <div key={`item-${index}`} style = {{ display: 'inline-flex', alignItems: 'center', margin: '0px 5px', cursor: 'pointer' }} onClick={() => { onClick(entry.dataKey); }}>
                <div style = {{ display: 'flex' }}>
                  <LinearScaleIcon style = {{ fontSize: '18px', color }} />
                </div>
                <div style = {{ display: 'flex', marginLeft: 5 }}>
                  <Typography type='body2' style = {{ color }}>{entry.value}</Typography>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  };


  type TooltipProps = {
    active?: boolean;
    payload?: { value: number, name: string, stroke: string, dataKey: string, unit: string | undefined, payload: object[]}[];
    label?: number;
  };

  // hijacks the lines unit property to determine if we should show Rankspan
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} style = {{ padding: '5px 10px' }}>
          <div><Typography style = {{ color: theme.text.secondary }} type='subtitle2'>{payload[0].payload?.[XAxisDataKey] || label}</Typography></div>
          {
            payload.map((entry, index) => {
              return (
                <div key = {index} style = {{ display: 'flex' }}><Typography type='body1' style = {{ color: entry.stroke }} >{entry.name}:</Typography><Typography style = {{ marginLeft: 5, color: entry.stroke }} type='body1'>{entry.value}{(rankMax && entry.unit === 'rank' && entry.payload[`${entry.dataKey}_rank`] ? <RankSpan rank = {entry.payload[`${entry.dataKey}_rank`]} max = {rankMax} useOrdinal = {true} /> : '')}</Typography></div>
              );
            })
          }
        </Paper>
      );
    }

    return null;
  };

  return (
    <div style = {{ display: 'flex', height: 300, padding: '0px 5px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{
            right: 10,
          }}
        >
          <CartesianGrid strokeDasharray = '3 3' />
          <XAxis dataKey = {XAxisDataKey} minTickGap={20} tickLine = {false} axisLine = {false} type='category' /* interval={'preserveStartEnd'} */ />
          <YAxis {...YAxisProps}>
            <Label offset={10} value={YAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: theme.info.main, fontSize: 18 }} />
          </YAxis>
          {
            referenceLines ?
              referenceLines.map((referenceLine, index) => {
                // {..referenceLine} spread doesnt work for some reason... I guess if you add a prop then add it here too >.<
                return <ReferenceLine key = {index} x = {referenceLine.x} stroke = {referenceLine.stroke} label = {referenceLine.label} />;
              }) :
              ''
          }
          <Legend layout='horizontal' align='center' verticalAlign='bottom' margin = {{ top: 0, left: 10, right: 0, bottom: 0 }} content={CustomLegend} />
          <Tooltip cursor = {{ stroke: theme.warning.main, strokeWidth: 2 }} content={<CustomTooltip />} />
          {
            lines.map((line, index) => {
              // {..line} spread doesnt work for some reason... I guess if you add a prop then add it here too >.<
              return (
                <Line
                  key = {index}
                  hide = {Boolean(line.dataKey && inactiveSeries.includes(line.dataKey.toString()))}
                  type={line.type}
                  name={line.name}
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  dot={line.dot}
                  connectNulls={line.connectNulls}
                  unit={line.unit}
                />
              );
            })
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
