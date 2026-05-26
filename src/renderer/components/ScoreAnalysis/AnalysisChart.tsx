import type React from 'react';
import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import GraphSettings from './graph/GraphSettings';
import ScoreGraph from './graph/ScoreGraph';
import type { TestExecution } from '../../../schemas/execution';
import type { AnalysisResponse, InputFeature } from '../../../schemas/analysis';

interface AnalysisChartProps {
  analysisResult: AnalysisResponse | null;
  executions: TestExecution[];
  selectedExecutionIds: string[];
  xAxis: string;
  currentXAxis: string;
  currentInputFilter: string;
  onXAxisChange: (value: string) => void;
  onInputFilterChange: (value: string) => void;
  onApply: () => void;
  applying: boolean;
  filteredInputs: InputFeature[];
  xValues: number[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  analysisResult,
  executions,
  selectedExecutionIds,
  xAxis,
  currentXAxis,
  currentInputFilter,
  onXAxisChange,
  onInputFilterChange,
  onApply,
  applying,
  filteredInputs,
  xValues,
}) => {
  const [useLogScale, setUseLogScale] = useState(false);
  const [useRelativeScore, setUseRelativeScore] = useState(false);

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '600px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">分析結果</Typography>
        <GraphSettings
          currentXAxis={currentXAxis}
          currentInputFilter={currentInputFilter}
          onXAxisChange={onXAxisChange}
          onInputFilterChange={onInputFilterChange}
          useLogScale={useLogScale}
          onToggleLogScale={setUseLogScale}
          useRelativeScore={useRelativeScore}
          onToggleRelativeScore={setUseRelativeScore}
          onApply={onApply}
          applying={applying}
        />
      </Box>

      {/* グラフの描画 */}
      <Box
        sx={{
          width: '100%',
          overflow: 'visible',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ScoreGraph
          analysisResult={analysisResult}
          executions={executions}
          selectedExecutionIds={selectedExecutionIds}
          useRelativeScore={useRelativeScore}
          useLogScale={useLogScale}
          xAxis={xAxis}
          filteredInputs={filteredInputs}
          xValues={xValues}
        />
      </Box>
    </Paper>
  );
};

export default AnalysisChart;
