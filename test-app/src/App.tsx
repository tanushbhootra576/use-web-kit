import { useState } from 'react';
import { 
  useSmartIntersection, 
  useWorkerPool, 
  useDebouncedStorage, 
  useEventPipeline, 
  useBroadcastState 
} from 'use-web-kit';

function HeavyWorkerComponent() {
  const [result, setResult] = useState<number | null>(null);
  
  const { run } = useWorkerPool((arr: number[]) => {
    return arr.reduce((a, b) => a + b, 0);
  });

  const handleCompute = async () => {
    const [promise] = run(Array.from({ length: 1000 }, (_, i) => i));
    const res = await promise;
    setResult(res);
  };

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
      <h3>useWorkerPool Test</h3>
      <button onClick={handleCompute}>Compute Sum of 1000 items</button>
      <p>Result: {result !== null ? result : 'Not computed yet'}</p>
    </div>
  );
}

function StorageComponent() {
  const { value: val, setValue: setVal } = useDebouncedStorage('test-key', 'initial');

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
      <h3>useDebouncedStorage Test</h3>
      <input 
        value={val} 
        onChange={e => setVal(e.target.value)} 
        placeholder="Type something..."
      />
      <p>Current Storage Value: {val}</p>
    </div>
  );
}

function IntersectionComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const { ref } = useSmartIntersection({
    onIntersect: (entry) => {
      setIsVisible(entry.isIntersecting);
    }
  });

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
      <h3>useSmartIntersection Test</h3>
      <div 
        ref={ref} 
        style={{ 
          height: '100px', 
          backgroundColor: isVisible ? 'lightgreen' : 'lightcoral',
          transition: 'background-color 0.3s'
        }}
      >
        {isVisible ? 'I am visible!' : 'Scroll down to see me'}
      </div>
    </div>
  );
}

function PipelineComponent() {
  const [status, setStatus] = useState('Idle');

  const { handler, isPending } = useEventPipeline<any, string>([
    async (data: string) => { setStatus('Step 1: Validating ' + data); await new Promise(r => setTimeout(r, 500)); return data; },
    async (data: string) => { setStatus('Step 2: Processing'); await new Promise(r => setTimeout(r, 500)); return data + ' processed'; },
    async (data: string) => { setStatus('Done: ' + data); return data; }
  ]);

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
      <h3>useEventPipeline Test</h3>
      <button onClick={() => handler('Hello')} disabled={isPending}>
        {isPending ? 'Running Pipeline...' : 'Run Pipeline'}
      </button>
      <p>Status: {status}</p>
    </div>
  );
}

function BroadcastComponent() {
  const [count, setCount] = useBroadcastState('test-broadcast', 0);

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
      <h3>useBroadcastState Test</h3>
      <p>Count across tabs: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>use-web-kit Functional Tests</h1>
      <StorageComponent />
      <BroadcastComponent />
      <PipelineComponent />
      <HeavyWorkerComponent />
      
      {/* Spacer to force scrolling for Intersection test */}
      <div style={{ height: '120vh', background: '#f5f5f5', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Scroll down...</p>
      </div>
      
      <IntersectionComponent />
    </div>
  );
}

export default App;
