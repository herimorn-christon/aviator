import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { Platform } from '../types';

export const SessionControl: React.FC = () => {
  const { startSession, endSession, isCollecting, toggleCollection, addDataPoint, settings } = useDataStore();
  const [error, setError] = useState<string | null>(null);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginWindow, setLoginWindow] = useState<Window | null>(null);

  // Add logging state
  const [logs, setLogs] = useState<string[]>([]);

  // Update URLs
  const LOGIN_URL = 'https://www.betpawa.co.tz/';
  const GAME_URL = 'https://aviator-next.spribegaming.com/?user=betpawa-tanzania_30ed00d7-ce4d-446a-ae64-ac83ff48f086&token=betpawa-tanzania_327ac14beb544859980c66189a6a9313&operator=betpawacotz&lang=en&currency=TZS&return_url=https://www.betpawa.co.tz/iframe-close.html?redirectBack%3Dundefined';
  const [currentUrl, setCurrentUrl] = useState(LOGIN_URL);

  const handleGameMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'game_round_end' && data.multiplier) {
        const multiplier = parseFloat(data.multiplier);
        if (!isNaN(multiplier) && multiplier !== lastMultiplier) {
          setLastMultiplier(multiplier);
          addDataPoint({
            timestamp: Date.now(),
            multiplier: multiplier,
            platform: 'betpawa',
            notes: 'Auto-collected'
          });
        }
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  }, [lastMultiplier, addDataPoint]);

  const handleAuth = useCallback(async (event: MessageEvent) => {
    try {
      // Listen for authentication success message
      if (event.origin === 'https://www.betpawa.co.tz' && event.data?.type === 'auth_success') {
        setIsAuthenticated(true);
        // Update GAME_URL with the fresh token from auth response
        if (iframeRef.current && event.data.aviatorUrl) {
          iframeRef.current.src = event.data.aviatorUrl;
        }
      }
    } catch (e) {
      setError('Authentication failed. Please try again.');
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) {
      try {
        // Check if we're at the Aviator game page
        const url = new URL(iframeRef.current.src);
        if (url.pathname.includes('aviator')) {
          setIsAuthenticated(true);
          // Store the fresh game URL
          setCurrentUrl(iframeRef.current.src);
        }
      } catch (e) {
        console.error('Error parsing iframe URL:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isCollecting) {
      window.addEventListener('message', handleGameMessage);
      return () => window.removeEventListener('message', handleGameMessage);
    }
  }, [isCollecting, handleGameMessage]);

  useEffect(() => {
    window.addEventListener('message', handleAuth);
    return () => window.removeEventListener('message', handleAuth);
  }, [handleAuth]);

  useEffect(() => {
    // Start session automatically when component mounts
    startSession('betpawa', 'betpawa');
    
    return () => endSession();
  }, []);

  const refreshIframe = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      // Use the most recent successful game URL
      iframeRef.current.src = currentUrl;
    }
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback duration
  };

  const openLoginWindow = () => {
    const width = 800;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const newWindow = window.open(
      LOGIN_URL,
      'BetPawaLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (newWindow) {
      setLoginWindow(newWindow);
      let detectedUrl = '';
      
      // Add log function
      const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
      };

      const checkInterval = setInterval(() => {
        try {
          if (!newWindow || newWindow.closed) {
            addLog('Login window closed');
            clearInterval(checkInterval);
            return;
          }

          try {
            const currentUrl = newWindow.location.href;
            
            // Add debug logging
            addLog(`🔍 Checking URL: ${currentUrl}`);

            // Check for Aviator in different ways
            if (
              currentUrl.includes('aviator-next.spribegaming.com') ||
              currentUrl.includes('/casino/game/aviator') ||
              currentUrl.includes('betpawa') && currentUrl.includes('aviator')
            ) {
              addLog('🎯 Found potential Aviator page!');
              
              // Wait briefly to ensure page is fully loaded
              setTimeout(() => {
                // Get the final URL after any redirects
                const finalUrl = newWindow.location.href;
                addLog(`📌 Final URL: ${finalUrl}`);
                
                setIsAuthenticated(true);
                setCurrentUrl(finalUrl);
                
                if (iframeRef.current) {
                  iframeRef.current.src = finalUrl;
                  addLog('✅ Updated iframe source');
                }

                localStorage.setItem('lastAviatorUrl', finalUrl);
                newWindow.close();
                clearInterval(checkInterval);
              }, 1000);
              
              return;
            }

          } catch (e) {
            // Special handling for security errors
            if (e instanceof DOMException && e.name === 'SecurityError') {
              // Try alternative detection through title
              try {
                const title = newWindow.document.title.toLowerCase();
                if (title.includes('aviator') || title.includes('betpawa')) {
                  addLog('📑 Detected Aviator through page title');
                  // Continue checking for full URL
                }
              } catch (titleError) {
                // Ignore title access errors
              }
            } else {
              addLog(`⚠️ Error: ${e.message}`);
            }
          }
        } catch (outerError) {
          addLog(`❌ Fatal error: ${outerError.message}`);
        }
      }, 100);

      // Add cleanup
      const cleanup = () => {
        clearInterval(checkInterval);
        if (newWindow && !newWindow.closed) {
          newWindow.close();
        }
      };

      // Cleanup after 2 minutes to prevent endless checking
      setTimeout(cleanup, 120000);

      // Cleanup on window close
      const closeCheck = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkInterval);
          clearInterval(closeCheck);
          if (!isAuthenticated && !detectedUrl) {
            setError('Login window was closed before URL was captured');
          }
        }
      }, 100);
    }
  };

  // Add URL change monitoring
  useEffect(() => {
    const logIframeUrl = () => {
      if (iframeRef.current) {
        const url = iframeRef.current.src;
        console.log('Current iframe URL:', url);
        addLog(`📍 iframe URL: ${url}`);
      }
    };

    // Log URL on mount and when currentUrl changes
    logIframeUrl();

    // Monitor iframe src changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          logIframeUrl();
        }
      });
    });

    if (iframeRef.current) {
      observer.observe(iframeRef.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, [currentUrl]);

  return (
    <div className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium">Betpawa Aviator</h2>
          <p className="text-sm text-gray-500">
            {isAuthenticated ? 'Auto-collecting game data' : 'Authentication required'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={refreshIframe}
                className={`p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Refresh game"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={endSession}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                End Session
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600">
              <Lock size={18} />
              <span className="text-sm">Login Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Authentication or Game iframe */}
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <Lock className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Login Required</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Please log in to BetPawa to start collecting data
          </p>
          <button
            onClick={openLoginWindow}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login to BetPawa
          </button>
        </div>
      ) : (
        <div className="mb-4 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            allow="fullscreen; cross-origin-isolated"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={() => addLog(`🔄 Iframe loaded: ${iframeRef.current?.src}`)}
          />
        </div>
      )}

      {/* Show controls only when authenticated */}
      {isAuthenticated && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCollecting ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-sm">
              {isCollecting ? 'Collecting Data' : 'Collection Paused'}
            </span>
          </div>
          
          <button
            onClick={toggleCollection}
            className={`p-2 rounded-md ${
              isCollecting
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isCollecting ? <Square size={18} /> : <Play size={18} />}
          </button>
        </div>
      )}

      {isCollecting && lastMultiplier && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Last collected multiplier: {lastMultiplier}x
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Add logs section */}
      <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="text-sm font-medium mb-2">URL Detection Logs</h3>
        <div className="h-32 overflow-y-auto text-xs font-mono">
          {logs.map((log, i) => (
            <div key={i} className="text-gray-600 dark:text-gray-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};