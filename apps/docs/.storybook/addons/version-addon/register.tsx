import React, { useCallback, useState } from 'react';
import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { useGlobals } from '@storybook/manager-api';
import semver from 'semver';

interface VersionOption {
  id: string;
  title: string;
  active: boolean;
  onClick: () => void;
}

const ADDON_ID = 'semver-features-version-selector';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'semverVersion';

const SAMPLE_VERSIONS = [
  '0.9.0',
  '1.0.0',
  '1.1.0', 
  '1.2.0',
  '1.3.0',
  '1.5.0-beta.1',
  '2.0.0-alpha.1',
  '2.0.0',
];

const VersionSelector = () => {
  const [globals, updateGlobals] = useGlobals();
  const [customVersion, setCustomVersion] = useState('');
  
  const selectedVersion = globals[PARAM_KEY] || '1.0.0';
  
  const changeVersion = useCallback((version: string) => {
    updateGlobals({ [PARAM_KEY]: version });
  }, [updateGlobals]);

  const handleCustomVersionSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (semver.valid(customVersion)) {
      changeVersion(customVersion);
      setCustomVersion('');
    }
  }, [customVersion, changeVersion]);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3>Current Version: {selectedVersion}</h3>
        <p>Select a version to see how features behave at different versions:</p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {SAMPLE_VERSIONS.map((version) => (
            <button
              key={version}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: selectedVersion === version ? '#3b82f6' : '#e2e8f0',
                color: selectedVersion === version ? 'white' : '#1e293b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => changeVersion(version)}
            >
              {version}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleCustomVersionSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={customVersion}
            onChange={(e) => setCustomVersion(e.target.value)}
            placeholder="Custom version (e.g. 1.4.2)"
            style={{ flexGrow: 1, padding: '8px' }}
          />
          <button 
            type="submit" 
            disabled={!semver.valid(customVersion)}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              backgroundColor: semver.valid(customVersion) ? '#3b82f6' : '#e2e8f0',
              color: semver.valid(customVersion) ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '4px',
              cursor: semver.valid(customVersion) ? 'pointer' : 'not-allowed',
            }}
          >
            Apply
          </button>
        </form>
      </div>
      
      <div>
        <h4>How this works:</h4>
        <p>This panel allows you to simulate different app versions to see how features would behave when your application is at specific versions.</p>
        <p>Features registered with semver-features will automatically enable/disable based on this selected version.</p>
      </div>
    </div>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Version Selector',
    render: ({ active }) => (
      <AddonPanel active={!!active}>
        <VersionSelector />
      </AddonPanel>
    ),
  });
  
  // Also add a toolbar item for quick access
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Version',
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const selectedVersion = globals[PARAM_KEY] || '1.0.0';
      
      const changeVersion = useCallback((version: string) => {
        updateGlobals({ [PARAM_KEY]: version });
      }, [updateGlobals]);
      
      return (
        <div 
          title={`Current Version: ${selectedVersion}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#2e3438',
            color: 'white',
            fontSize: '12px',
            height: '28px',
          }}
          onClick={() => {
            // Simply toggle through the versions on click
            const currentIndex = SAMPLE_VERSIONS.indexOf(selectedVersion);
            const nextIndex = (currentIndex + 1) % SAMPLE_VERSIONS.length;
            changeVersion(SAMPLE_VERSIONS[nextIndex]);
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span role="img" aria-label="version">📦</span>
            <span>{selectedVersion}</span>
          </div>
        </div>
      );
    },
  });
}); 