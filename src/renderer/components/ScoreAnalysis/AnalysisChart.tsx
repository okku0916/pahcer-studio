import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import GraphSettings from './graph/GraphSettings';
import ScoreGraph from './graph/ScoreGraph';
import type { TestExecution } from '../../../schemas/execution';
import type { AnalysisResponse } from '../../../schemas/analysis';
import { useInputFilter } from './hooks/useGraphData';

interface AnalysisChartProps {
  analysisResult: AnalysisResponse | null;
  executions: TestExecution[];
  selectedExecutionIds: string[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  analysisResult,
  executions,
  selectedExecutionIds,
}) => {
  // チャート固有の状態
  const [xAxis, setXAxis] = useState('seed');
  const [inputFilter, setInputFilter] = useState('');
  const [useLogScale, setUseLogScale] = useState(false);
  const [useRelativeScore, setUseRelativeScore] = useState(false);

  // 現在の値と適用される値を分離
  const [currentInputFilter, setCurrentInputFilter] = useState('');
  const [currentXAxis, setCurrentXAxis] = useState('seed');
  const [applyingSettings, setApplyingSettings] = useState(false);

  const [seedViewAxis, setSeedViewAxis] = useState('seed');
  const [seedViewValue, setSeedViewValue] = useState('');

  const applyGraphSettings = () => {
    setApplyingSettings(true);
    setInputFilter(currentInputFilter);
    setXAxis(currentXAxis);
    setApplyingSettings(false);
  };

  const { filteredInputs, xValues } = useInputFilter(
    analysisResult,
    selectedExecutionIds,
    xAxis,
    inputFilter,
  );

  const seedAxisCandidates = useMemo(() => {
    if (!analysisResult?.inputFeatures?.length) return ['seed'];
    const keys = Object.keys(analysisResult.inputFeatures[0].features || {});
    return ['seed', ...keys];
  }, [analysisResult]);

  const filteredSeeds = useMemo(() => {
    if (!filteredInputs.length) return [] as number[];
    if (!seedViewValue.trim()) return [] as number[];
    const valueNumber = Number(seedViewValue);
    if (Number.isNaN(valueNumber)) return [] as number[];

    const seeds = filteredInputs
      .filter((input) => {
        if (seedViewAxis === 'seed') {
          return input.seed === valueNumber;
        }
        const featureValue = input.features?.[seedViewAxis];
        return typeof featureValue === 'number' && featureValue === valueNumber;
      })
      .map((input) => input.seed)
      .sort((a, b) => a - b);

    return seeds;
  }, [filteredInputs, seedViewAxis, seedViewValue]);

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
          onXAxisChange={setCurrentXAxis}
          onInputFilterChange={setCurrentInputFilter}
          useLogScale={useLogScale}
          onToggleLogScale={setUseLogScale}
          useRelativeScore={useRelativeScore}
          onToggleRelativeScore={setUseRelativeScore}
          onApply={applyGraphSettings}
          applying={applyingSettings}
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
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Typography variant="subtitle1">Seed一覧</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="seed-view-axis-label">軸</InputLabel>
              <Select
                labelId="seed-view-axis-label"
                label="軸"
                value={seedViewAxis}
                onChange={(e) => setSeedViewAxis(String(e.target.value))}
              >
                {seedAxisCandidates.map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="値"
              size="small"
              value={seedViewValue}
              onChange={(e) => setSeedViewValue(e.target.value)}
              placeholder="例: 5"
            />
            <Typography variant="body2" color="text.secondary">
              {seedViewValue.trim()
                ? `該当seed: ${filteredSeeds.length}件`
                : '軸と値を入力するとseed一覧が表示されます'}
            </Typography>
          </Box>
          {seedViewValue.trim() && (
            <Box
              sx={{
                typography: 'body2',
                whiteSpace: 'pre-wrap',
                maxHeight: 120,
                overflowY: 'auto',
              }}
            >
              {filteredSeeds.length > 0 ? filteredSeeds.join(', ') : '該当するseedがありません'}
            </Box>
          )}
        </Paper>
        <ScoreGraph
          analysisResult={analysisResult}
          executions={executions}
          selectedExecutionIds={selectedExecutionIds}
          inputFilter={inputFilter}
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
