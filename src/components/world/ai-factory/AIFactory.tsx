import React from 'react';
import { AIFactoryInfrastructure } from './AIFactoryInfrastructure';
import { AIFactoryDepartmentsA } from './AIFactoryDepartmentsA';
import { AIFactoryDepartmentsB } from './AIFactoryDepartmentsB';
import { useStore } from '../../../store/useStore';
import { AI_DEPARTMENTS } from '../../../data/aiFactoryData';

export const AIFactory: React.FC = () => {
  const activeFactoryDeptId = useStore((s) => s.gameState.activeFactoryDeptId);
  const nearbyFactoryDeptId = useStore((s) => s.gameState.nearbyFactoryDeptId);
  const tourActive = useStore((s) => s.gameState.tourActive);
  const tourStepIndex = useStore((s) => s.gameState.tourStepIndex);
  const factoryQuery = useStore((s) => s.gameState.factoryQuery);
  const factoryOutputFormat = useStore((s) => s.gameState.factoryOutputFormat);

  const tourDeptId = tourActive ? AI_DEPARTMENTS[tourStepIndex]?.id ?? null : null;
  const highlightedDeptId = activeFactoryDeptId || tourDeptId || nearbyFactoryDeptId;

  return (
    <group>
      <AIFactoryInfrastructure
        activeDeptId={highlightedDeptId}
        nearbyDeptId={nearbyFactoryDeptId}
      />
      <AIFactoryDepartmentsA activeDeptId={highlightedDeptId} />
      <AIFactoryDepartmentsB
        activeDeptId={highlightedDeptId}
        factoryQuery={factoryQuery}
        factoryOutputFormat={factoryOutputFormat}
      />
    </group>
  );
};

export default AIFactory;

