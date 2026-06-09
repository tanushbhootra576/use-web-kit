import { 
  useSmartIntersection, 
  useIntersection, 
  useMediaControls, 
  useWorkerPool, 
  useIdleQueue, 
  useAdaptivePolling, 
  useDebouncedStorage, 
  useStorage, 
  useBroadcastState, 
  useNetworkStatus, 
  usePageLifecycle, 
  usePermission, 
  useEventPipeline, 
  useActionPipeline,
  fromEvent,
  debounce,
  fromFormData
} from "use-web-kit";
import { useState, useRef } from "react";

// Mock intensive math function for useWorkerPool
const sortLargeArray = () => {
  const arr = Array.from({ length: 100000 }, () => Math.random());
  arr.sort();
  return "Sorted 100,000 items";
};

// Mock task for useIdleQueue
const mockIdleTask = () => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), 50));
};

// Mock server action for useActionPipeline
const mockServerAction = async (formData: any) => {
  console.log(formData);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

const Card = ({ title, children, state }: { title: string, children: React.ReactNode, state?: any }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
    <div className="flex-1 flex flex-col gap-3">
      {children}
    </div>
    {state !== undefined && (
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto text-gray-800 dark:text-gray-300">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    )}
  </div>
);

const DOMEngineSection = () => {
  // useSmartIntersection
  const [smartIntersecting, setSmartIntersecting] = useState(false);
  const { ref: smartRef } = useSmartIntersection({
    onIntersect: () => setSmartIntersecting(true)
  });

  // useIntersection
  const intersectionEntry = useIntersection({ rootMargin: "200px" });

  // useMediaControls
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { state: mediaState, controls: mediaControls, ref: bindAudio } = useMediaControls();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 p-2 rounded-lg text-sm">01</span>
        DOM Engine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="useSmartIntersection" state={{ isIntersecting: smartIntersecting }}>
          <div 
            ref={smartRef as any} 
            className="w-full h-24 bg-purple-500 rounded-xl flex items-center justify-center text-white font-medium shadow-inner transition-colors duration-300"
            style={{ backgroundColor: smartIntersecting ? '#a855f7' : '#d8b4fe' }}
          >
            {smartIntersecting ? 'Visible!' : 'Scroll me into view'}
          </div>
        </Card>

        <Card title="useIntersection" state={{ isIntersecting: intersectionEntry?.isIntersecting }}>
          <div 
            ref={intersectionEntry.ref as any} 
            className="w-full h-24 bg-blue-500 rounded-xl flex items-center justify-center text-white font-medium shadow-inner transition-colors duration-300"
            style={{ backgroundColor: intersectionEntry?.isIntersecting ? '#3b82f6' : '#93c5fd' }}
          >
            200px Root Margin
          </div>
        </Card>

        <Card title="useMediaControls" state={mediaState}>
          <audio 
            ref={(node) => {
              audioRef.current = node;
              bindAudio(node);
            }}
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
            className="hidden" 
          />
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => mediaControls.play()} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Play
            </button>
            <button 
              onClick={() => mediaControls.pause()} 
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Pause
            </button>
            <button 
              onClick={() => mediaControls.setVolume(mediaState.volume === 0 ? 1 : 0)} 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Mute Toggle
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ConcurrencyEngineSection = () => {
  // useWorkerPool
  const [workerResult, setWorkerResult] = useState<string | null>(null);
  const workerPool = useWorkerPool<[], string>(sortLargeArray, { maxWorkers: 2 });
  
  const runWorker = async () => {
    try {
      const [promise] = workerPool.run();
      const res = await promise;
      setWorkerResult(res);
    } catch (e: any) {
      setWorkerResult(e.message);
    }
  };

  // useIdleQueue
  const idleQueue = useIdleQueue();
  const enqueueTask = () => {
    idleQueue.enqueue(mockIdleTask);
  };

  // useAdaptivePolling
  const [pollCount, setPollCount] = useState(0);
  useAdaptivePolling(() => {
    setPollCount(p => p + 1);
  }, { interval: 1000 });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-2 rounded-lg text-sm">02</span>
        Concurrency Engine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="useWorkerPool" state={{ isRunning: workerPool.isRunning, pendingCount: workerPool.pendingCount, result: workerResult }}>
          <button 
            onClick={runWorker} 
            disabled={workerPool.isRunning}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {workerPool.isRunning ? 'Sorting...' : 'Trigger Heavy Sort'}
          </button>
        </Card>

        <Card title="useIdleQueue" state={{ queueLength: idleQueue.queueLength }}>
          <button 
            onClick={enqueueTask} 
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Enqueue Idle Task
          </button>
        </Card>

        <Card title="useAdaptivePolling" state={{ counter: pollCount }}>
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
            Pass a callback and options to useAdaptivePolling.
            Currently using Adaptive Polling (internal state hidden).
          </div>
        </Card>
      </div>
    </div>
  );
};

const StateEngineSection = () => {
  // useDebouncedStorage
  const debouncedStorage = useDebouncedStorage<string>("test-debounced", "");
  const [instantVal, setInstantVal] = useState(debouncedStorage.value);

  const handleDebounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstantVal(e.target.value);
    debouncedStorage.setValue(e.target.value);
  };

  // useStorage
  const storage = useStorage<string>("test-theme", "light");

  // useBroadcastState
  const [sharedCount, setSharedCount] = useBroadcastState<number>("test-broadcast-count", 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 p-2 rounded-lg text-sm">03</span>
        State Engine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="useDebouncedStorage" state={{ immediateValue: instantVal, storedValue: debouncedStorage.value }}>
          <input 
            type="text" 
            value={instantVal} 
            onChange={handleDebounceChange} 
            placeholder="Type quickly..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </Card>

        <Card title="useStorage" state={{ syncValue: storage.value }}>
          <button 
            onClick={() => storage.setValue(storage.value === 'light' ? 'dark' : 'light')} 
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Toggle Theme (Current: {storage.value})
          </button>
        </Card>

        <Card title="useBroadcastState" state={{ sharedCounter: sharedCount }}>
          <button 
            onClick={() => setSharedCount(sharedCount + 1)} 
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Increment Cross-Tab (+1)
          </button>
          <p className="text-xs text-gray-500 mt-2">Open another tab to see O(1) sync.</p>
        </Card>
      </div>
    </div>
  );
};

const BOMEngineSection = () => {
  // useNetworkStatus
  const network = useNetworkStatus();

  // usePageLifecycle
  const lifecycle = usePageLifecycle();

  // usePermission
  const permission = usePermission("notifications");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 p-2 rounded-lg text-sm">04</span>
        BOM Engine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="useNetworkStatus" state={{ 
          online: network.online, 
          effectiveType: network.effectiveType, 
          downlink: network.downlink, 
          rtt: network.rtt 
        }}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${network.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium dark:text-gray-300">{network.online ? 'Online' : 'Offline'}</span>
          </div>
        </Card>

        <Card title="usePageLifecycle" state={{ visible: lifecycle.visible, focused: lifecycle.focused, frozen: lifecycle.frozen }}>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Switch tabs or minimize to observe changes.
          </div>
        </Card>

        <Card title="usePermission" state={{ state: permission.state }}>
          <button 
            onClick={permission.request} 
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Request Notifications
          </button>
        </Card>
      </div>
    </div>
  );
};

const PipelinesSection = () => {
  // useEventPipeline
  const eventPipeline = useEventPipeline([
    fromEvent(),
    debounce(400)
  ]);

  // useActionPipeline
  const actionPipeline = useActionPipeline([
    fromFormData("data")
  ], {
    action: mockServerAction
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300 p-2 rounded-lg text-sm">05</span>
        Action Pipelines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="useEventPipeline" state={{ isPending: eventPipeline.isPending, result: eventPipeline.value, error: eventPipeline.error }}>
          <input 
            type="text" 
            onChange={eventPipeline.handler}
            placeholder="Search API simulation (debounced)..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </Card>

        <Card title="useActionPipeline" state={{ isPending: actionPipeline.isPending, value: actionPipeline.value, error: actionPipeline.error }}>
          <form action={actionPipeline.formAction as unknown as string} className="flex flex-col gap-3">
            <input 
              name="data" 
              type="text" 
              placeholder="Enter form data..."
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <button 
              type="submit" 
              disabled={actionPipeline.isPending}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {actionPipeline.isPending ? (
                <span className="animate-pulse">Submitting...</span>
              ) : 'Submit Action'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            use-web-kit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Visual Testing Dashboard
          </p>
        </div>

        <DOMEngineSection />
        <ConcurrencyEngineSection />
        <StateEngineSection />
        <BOMEngineSection />
        <PipelinesSection />

      </div>
    </div>
  );
}
