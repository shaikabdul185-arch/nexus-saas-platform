import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, CreditCard, Building, Activity, Server, Database, Terminal, CheckCircle2, RefreshCw, Cpu, Layout, Power, Play, StopCircle, PauseCircle, Layers, Box, Laptop, Code, FileJson, ArrowRight, Globe, FileCode, Package, Upload, Eye, Shield, Lock, Rocket, List, ScrollText } from 'lucide-react';
import { Tenant } from '../types';

interface SettingsViewProps {
  tenant: Tenant;
  onUpdate: (id: string, data: Partial<Tenant>) => void;
}

type TabId = 'general' | 'billing' | 'system';
type EnvMode = 'docker' | 'backend' | 'frontend' | 'production';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  service: 'api' | 'db' | 'worker' | 'redis' | 'system' | 'uvicorn' | 'pip' | 'alembic' | 'npm' | 'vite' | 'config' | 'web';
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'stopped' | 'degraded' | 'booting' | 'installing' | 'migrating' | 'configuring';
  uptime: string;
  latency: string;
  version: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ tenant, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [envMode, setEnvMode] = useState<EnvMode>('docker');
  const [name, setName] = useState(tenant.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [dbStatus, setDbStatus] = useState<'idle' | 'backing_up' | 'restoring'>('idle');
  const [redisStatus, setRedisStatus] = useState<'idle' | 'monitoring'>('idle');
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  // Mock System State for Docker
  const [dockerServices, setDockerServices] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'operational', uptime: '99.99%', latency: '45ms', version: 'v2.4.0' },
    { name: 'PostgreSQL DB', status: 'operational', uptime: '99.95%', latency: '12ms', version: '15.4' },
    { name: 'Redis Cache', status: 'operational', uptime: '100%', latency: '2ms', version: '7.0' },
    { name: 'Gemini AI Worker', status: 'operational', uptime: '99.9%', latency: '850ms', version: '1.2' },
  ]);

  // Mock State for Local Backend
  const [backendServices, setBackendServices] = useState<ServiceStatus[]>([
    { name: 'Virtual Env', status: 'stopped', uptime: '-', latency: '-', version: 'Python 3.11' },
    { name: 'Local DB', status: 'operational', uptime: '2d 4h', latency: '0ms', version: 'Postgres 15' },
    { name: 'Uvicorn Server', status: 'stopped', uptime: '-', latency: '-', version: '0.27.0' },
  ]);

  // Mock State for Local Frontend
  const [frontendServices, setFrontendServices] = useState<ServiceStatus[]>([
    { name: 'Node Modules', status: 'stopped', uptime: '-', latency: '-', version: '-' },
    { name: 'Env Config', status: 'stopped', uptime: '-', latency: '-', version: '-' },
    { name: 'Vite Server', status: 'stopped', uptime: '-', latency: '-', version: 'Vite 5.1.4' },
  ]);

  // Mock State for Production
  const [productionServices, setProductionServices] = useState<ServiceStatus[]>([
    { name: 'Production Config', status: 'stopped', uptime: '-', latency: '-', version: '-' },
    { name: 'SSL Certificates', status: 'stopped', uptime: '-', latency: '-', version: '-' },
    { name: 'Prod Environment', status: 'stopped', uptime: '-', latency: '-', version: 'Pending' },
  ]);

  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: new Date(Date.now() - 10000).toISOString(), level: 'INFO', message: 'System initialized successfully', service: 'system' },
  ]);

  // Auto-scroll logic
  useEffect(() => {
    if (activeTab === 'system' && logsContainerRef.current && shouldAutoScroll) {
      const container = logsContainerRef.current;
      // Use instant scroll to prevent fighting the user
      container.scrollTop = container.scrollHeight;
    }
  }, [logs, activeTab, shouldAutoScroll]);

  // Reset auto-scroll when switching tabs
  useEffect(() => {
    if (activeTab === 'system') {
      setShouldAutoScroll(true);
      // Small timeout to ensure layout is ready before initial scroll
      setTimeout(() => {
        if (logsContainerRef.current) {
          logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [activeTab]);

  const handleScroll = () => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      // Check if user is AT the bottom.
      // Threshold set to 2px to immediately disable auto-scroll if user scrolls up.
      // This prevents the "fighting" feeling where you scroll up a bit and get yanked back.
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Simulate Live Logs
  useEffect(() => {
    if (activeTab !== 'system') return;

    const interval = setInterval(() => {
      const isDocker = envMode === 'docker';
      const isBackend = envMode === 'backend';
      const isFrontend = envMode === 'frontend';
      const isProduction = envMode === 'production';

      // Check for Redis Monitoring (Higher frequency if monitoring)
      if (isDocker && redisStatus === 'monitoring') {
        const redisCmds = [
            'GET tenant:t1:config', 
            'SET session:8f9a2 active EX 3600', 
            'HGETALL user:4402', 
            'PING', 
            'ZADD leaderboard 100 user:1',
            'LPUSH task_queue {"job": "email"}'
        ];
        const cmd = redisCmds[Math.floor(Math.random() * redisCmds.length)];
        const timestamp = (Date.now() / 1000).toFixed(6);
        
        // 70% chance to show a monitor log per tick
        if (Math.random() > 0.3) {
            setLogs(prev => [...prev.slice(-99), {
                id: Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: `${timestamp} [0 172.18.0.4:56238] "${cmd}"`,
                service: 'redis'
             }]);
             return; // Skip regular background logs if we did a monitor log to avoid spamming too much
        }
      }

      // 40% chance to emit a log normally, higher if active work
      if (Math.random() > 0.4) return;

      let newLog: SystemLog | null = null;

      if (isDocker) {
        const runningServices = dockerServices.filter(s => s.status === 'operational');
        if (runningServices.length === 0 && !dockerServices.some(s => s.status === 'installing' || s.status === 'migrating' || s.status === 'booting')) return;
        
        const randomService = runningServices[Math.floor(Math.random() * runningServices.length)];
        if (!randomService) return;
        
        const messages = [
          `Processing request ${Math.floor(Math.random() * 10000).toString(16)}`,
          `Health check passed: ${randomService.name}`,
          `Metric collected: cpu=${Math.floor(Math.random() * 60 + 10)}%`,
          `Cache hit ratio: ${Math.floor(Math.random() * 15 + 85)}%`,
          `GET /api/v1/metrics 200 OK`,
        ];
        
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const type = randomService.name.includes('DB') ? 'db' : randomService.name.includes('API') ? 'api' : randomService.name.includes('Redis') ? 'redis' : 'worker';

        newLog = {
          id: Date.now().toString() + Math.random(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: msg,
          service: type as any
        };
      } else if (isBackend) {
        // Backend Mode Logs
        const uvicornRunning = backendServices.find(s => s.name === 'Uvicorn Server')?.status === 'operational';
        if (uvicornRunning) {
            const methods = ['GET', 'POST', 'PUT', 'OPTIONS'];
            const paths = ['/api/users', '/api/tenants', '/api/health', '/docs', '/openapi.json'];
            const statusCodes = [200, 200, 200, 201, 400, 401, 422];
            
            newLog = {
                id: Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: `${methods[Math.floor(Math.random() * methods.length)]} ${paths[Math.floor(Math.random() * paths.length)]} HTTP/1.1 ${statusCodes[Math.floor(Math.random() * statusCodes.length)]} OK`,
                service: 'uvicorn'
            };
        }
      } else if (isFrontend) {
        // Frontend Mode Logs
        const viteRunning = frontendServices.find(s => s.name === 'Vite Server')?.status === 'operational';
        if (viteRunning) {
          const msgs = [
            `[vite] hmr update /src/App.tsx`,
            `[vite] hmr update /src/components/SettingsView.tsx`,
            `[vite] page reload components/DashboardView.tsx`,
            `[vite] new dependencies optimized: lucide-react, recharts`,
            `POST /@vite/client 200 OK`,
          ];
          newLog = {
            id: Date.now().toString() + Math.random(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: msgs[Math.floor(Math.random() * msgs.length)],
            service: 'vite'
          };
        }
      } else if (isProduction) {
        // Production Logs - quieter, more formal
        const prodRunning = productionServices.some(s => s.name === 'Prod Environment' && s.status === 'operational');
        if (prodRunning && Math.random() > 0.6) {
             const msgs = [
                `[nginx] 172.18.0.1 - - "GET /api/v1/status HTTP/1.1" 200 142`,
                `[postgres] LOG: checkpoint starting: time`,
                `[api] INFO: Processing background task: generate_invoice`,
                `[security] INFO: Token refresh for user_id: 9432`,
             ];
             const svcMap = { '[nginx]': 'web', '[postgres]': 'db', '[api]': 'api', '[security]': 'system' };
             const msg = msgs[Math.floor(Math.random() * msgs.length)];
             const svcKey = Object.keys(svcMap).find(k => msg.startsWith(k));
             
             newLog = {
                id: Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: msg,
                service: svcKey ? (svcMap as any)[svcKey] : 'system'
             };
        }
      }

      if (newLog) {
        setLogs(prev => [...prev.slice(-99), newLog!]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [activeTab, envMode, dockerServices, backendServices, frontendServices, productionServices, redisStatus]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(tenant.id, { name });
      setIsSaving(false);
    }, 800);
  };

  // Docker Controls
  const toggleDockerService = (serviceName: string) => {
    setDockerServices(prev => prev.map(s => {
      if (s.name === serviceName) {
        const isStopping = s.status === 'operational';
        const newStatus = isStopping ? 'stopped' : 'operational';
        
        const log: SystemLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'WARN',
          message: `${isStopping ? 'Stopping' : 'Starting'} container: ${s.name}...`,
          service: 'system'
        };
        setLogs(current => [...current, log]);
        
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const handleDockerGroupPower = (group: 'data' | 'app', action: 'up' | 'down') => {
    const targetServices = group === 'data' 
      ? ['PostgreSQL DB', 'Redis Cache']
      : ['API Gateway', 'Gemini AI Worker'];
    
    const isUp = action === 'up';

    const log: SystemLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `Executing: docker-compose ${isUp ? 'up -d' : 'stop'} ${group === 'data' ? 'db redis' : 'api worker'}`,
      service: 'system'
    };
    setLogs(current => [...current, log]);

    if (isUp) {
        setDockerServices(prev => prev.map(s => {
            if (targetServices.includes(s.name) && s.status !== 'operational') return { ...s, status: 'booting' };
            return s;
        }));
        
        setTimeout(() => {
            setDockerServices(prev => prev.map(s => {
                if (targetServices.includes(s.name)) return { ...s, status: 'operational' };
                return s;
            }));
            setLogs(c => [...c, {
               id: Date.now().toString(),
               timestamp: new Date().toISOString(),
               level: 'INFO',
               message: `Group '${group}' services started successfully.`,
               service: 'system'
            }]);
        }, 1500);
    } else {
        setDockerServices(prev => prev.map(s => {
            if (targetServices.includes(s.name)) return { ...s, status: 'stopped' };
            return s;
        }));
    }
  };

  const handleGlobalPower = (action: 'up' | 'down') => {
    const targetStatus = action === 'up' ? 'operational' : 'stopped';
    
    const log: SystemLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message: `Global ${action === 'up' ? 'startup' : 'shutdown'} sequence initiated via docker-compose...`,
      service: 'system'
    };
    setLogs(prev => [...prev, log]);

    if (action === 'up') {
      setDockerServices(prev => prev.map(s => ({ ...s, status: 'booting' })));
      setTimeout(() => {
        setDockerServices(prev => prev.map(s => ({ ...s, status: targetStatus })));
        setLogs(c => [...c, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: `All services started successfully.`,
          service: 'system'
        }]);
      }, 1500);
    } else {
      setDockerServices(prev => prev.map(s => ({ ...s, status: targetStatus })));
    }
  };

  const handleDbAction = (action: 'connect' | 'backup' | 'restore' | 'reset_password') => {
    if (action === 'connect') {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '$ docker exec -it saas_db psql -U postgres -d saas_db',
        service: 'system'
      }]);
      setTimeout(() => {
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'psql (15.4)',
          service: 'db'
        }, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'Type "help" for help.',
          service: 'db'
        }, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'saas_db=# _',
          service: 'db'
        }]);
      }, 500);
    }
    
    if (action === 'backup') {
      setDbStatus('backing_up');
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '$ docker exec -t saas_db pg_dump -U postgres saas_db > backup.sql',
        service: 'system'
      }]);
      
      // Simulate progress
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Dumping database structure...', service: 'db' }]), 800);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Dumping data for table "users"...', service: 'db' }]), 1600);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Dumping data for table "tenants"...', service: 'db' }]), 2400);
      
      setTimeout(() => {
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Backup completed successfully: backup.sql (45MB)', service: 'system' }]);
         setDbStatus('idle');
      }, 3200);
    }
  
    if (action === 'restore') {
       setDbStatus('restoring');
       setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message: '$ docker exec -i saas_db psql -U postgres -d saas_db < backup.sql',
        service: 'system'
      }]);
  
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'SET', service: 'db' }]), 500);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'CREATE TABLE', service: 'db' }]), 1200);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'COPY 1240', service: 'db' }]), 2000);
  
      setTimeout(() => {
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Database restored successfully.', service: 'system' }]);
         setDbStatus('idle');
      }, 3000);
    }

    if (action === 'reset_password') {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message: 'Executing SQL update for admin credentials...',
        service: 'system'
      }]);
      
      setTimeout(() => {
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: "$ docker exec -i saas_db psql -U postgres -d saas_db -c \"UPDATE users SET password_hash = 'new_hashed_password' WHERE email = 'admin@example.com';\"",
          service: 'system'
        }]);
      }, 800);
      
      setTimeout(() => {
        setLogs(prev => [...prev, {
           id: Date.now().toString(),
           timestamp: new Date().toISOString(),
           level: 'INFO',
           message: 'UPDATE 1',
           service: 'db'
        }]);
      }, 1600);

      setTimeout(() => {
         setLogs(prev => [...prev, {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: 'Operation completed.',
            service: 'system'
         }]);
      }, 2400);
    }
  };

  const handleRedisAction = (action: 'connect' | 'monitor') => {
    if (action === 'connect') {
        setLogs(prev => [...prev, {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: '$ docker exec -it saas_redis redis-cli',
            service: 'system'
        }]);
        setTimeout(() => {
            setLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: '127.0.0.1:6379> _',
                service: 'redis'
            }]);
        }, 500);
    }

    if (action === 'monitor') {
        if (redisStatus === 'monitoring') {
            setRedisStatus('idle');
            setLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: '^C',
                service: 'system'
            }, {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: 'Monitoring stopped.',
                service: 'system'
            }]);
            return;
        }

        setRedisStatus('monitoring');
        setLogs(prev => [...prev, {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: '$ docker exec -it saas_redis redis-cli monitor',
            service: 'system'
        }]);
        setLogs(prev => [...prev, {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: 'OK',
            service: 'redis'
        }]);
    }
  };

  // Backend Controls
  const runBackendCommand = (cmd: 'install' | 'migrate' | 'start' | 'stop') => {
      if (cmd === 'install') {
          setBackendServices(prev => prev.map(s => s.name === 'Virtual Env' ? { ...s, status: 'installing' } : s));
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '(venv) $ pip install -r requirements.txt', service: 'pip' }]);
          
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Downloading fastapi-0.109.0-py3-none-any.whl (92 kB)', service: 'pip' }]);
          }, 800);
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Installing collected packages: typing-extensions, pydantic, starlette, fastapi', service: 'pip' }]);
          }, 1600);
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Successfully installed fastapi-0.109.0 uvicorn-0.27.0', service: 'pip' }]);
             setBackendServices(prev => prev.map(s => s.name === 'Virtual Env' ? { ...s, status: 'operational', version: 'Ready' } : s));
          }, 2400);
      }

      if (cmd === 'migrate') {
          setBackendServices(prev => prev.map(s => s.name === 'Local DB' ? { ...s, status: 'migrating' } : s));
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '(venv) $ alembic upgrade head', service: 'alembic' }]);
          
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.', service: 'alembic' }]);
          }, 600);
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO  [alembic.runtime.migration] Will assume transactional DDL.', service: 'alembic' }]);
          }, 1200);
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO  [alembic.runtime.migration] Running upgrade -> 1234rev (create_users_table)', service: 'alembic' }]);
             setBackendServices(prev => prev.map(s => s.name === 'Local DB' ? { ...s, status: 'operational' } : s));
          }, 2000);
      }

      if (cmd === 'start') {
          setBackendServices(prev => prev.map(s => s.name === 'Uvicorn Server' ? { ...s, status: 'booting' } : s));
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '(venv) $ uvicorn app.main:app --reload --host 0.0.0.0 --port 8000', service: 'uvicorn' }]);
          
          setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO:     Will watch for changes in these directories: [\'/Users/dev/nexus/backend\']', service: 'uvicorn' }]);
          }, 500);
           setTimeout(() => {
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)', service: 'uvicorn' }]);
             setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO:     Started server process [44122]', service: 'uvicorn' }]);
             setBackendServices(prev => prev.map(s => s.name === 'Uvicorn Server' ? { ...s, status: 'operational' } : s));
          }, 1500);
      }
      
      if (cmd === 'stop') {
          setBackendServices(prev => prev.map(s => s.name === 'Uvicorn Server' ? { ...s, status: 'stopped' } : s));
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'WARN', message: '^CINFO:     Shutting down', service: 'uvicorn' }]);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'INFO:     Finished server process [44122]', service: 'uvicorn' }]);
      }
  };

  // Frontend Controls
  const runFrontendCommand = (cmd: 'install' | 'config' | 'start' | 'stop') => {
      if (cmd === 'install') {
        setFrontendServices(prev => prev.map(s => s.name === 'Node Modules' ? { ...s, status: 'installing' } : s));
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ npm install', service: 'npm' }]);
        
        setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'npm WARN deprecated inflight@1.0.6: This module is not supported', service: 'npm' }]);
        }, 800);
        setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'added 843 packages, and audited 844 packages in 2s', service: 'npm' }]);
          setFrontendServices(prev => prev.map(s => s.name === 'Node Modules' ? { ...s, status: 'operational', version: 'v18.17.0' } : s));
        }, 1800);
      }

      if (cmd === 'config') {
        setFrontendServices(prev => prev.map(s => s.name === 'Env Config' ? { ...s, status: 'configuring' } : s));
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ cp .env.template .env', service: 'system' }]);
        
        setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '.env file created successfully from template', service: 'system' }]);
          setFrontendServices(prev => prev.map(s => s.name === 'Env Config' ? { ...s, status: 'operational' } : s));
        }, 1000);
      }

      if (cmd === 'start') {
        setFrontendServices(prev => prev.map(s => s.name === 'Vite Server' ? { ...s, status: 'booting' } : s));
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ npm run dev', service: 'npm' }]);
        
        setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '> nexus-saas@0.1.0 dev', service: 'npm' }]);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '> vite', service: 'vite' }]);
        }, 500);
        
        setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '  VITE v5.1.4  ready in 340 ms', service: 'vite' }]);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '  ➜  Local:   http://localhost:5173/', service: 'vite' }]);
          setFrontendServices(prev => prev.map(s => s.name === 'Vite Server' ? { ...s, status: 'operational' } : s));
        }, 1500);
      }

      if (cmd === 'stop') {
        setFrontendServices(prev => prev.map(s => s.name === 'Vite Server' ? { ...s, status: 'stopped' } : s));
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'q', service: 'vite' }]);
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Server stopped', service: 'vite' }]);
      }
  };

  // Production Controls
  const runProductionCommand = (cmd: 'create_config' | 'edit_config' | 'setup_ssl' | 'install_certs' | 'deploy' | 'check_status' | 'view_logs') => {
    if (cmd === 'create_config') {
      setProductionServices(prev => prev.map(s => s.name === 'Production Config' ? { ...s, status: 'installing' } : s));
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ cp .env.template .env.production', service: 'system' }]);
      
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Created .env.production', service: 'system' }]);
        setProductionServices(prev => prev.map(s => s.name === 'Production Config' ? { ...s, status: 'operational', version: 'v1.0' } : s));
      }, 1000);
    }

    if (cmd === 'edit_config') {
      setProductionServices(prev => prev.map(s => s.name === 'Production Config' ? { ...s, status: 'configuring' } : s));
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ nano .env.production', service: 'system' }]);
      
      setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '  GNU nano 7.2', service: 'system' }]);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '  Reading .env.production', service: 'system' }]);
      }, 500);

       setTimeout(() => {
          const envLines = [
            'DEBUG=False',
            'ENVIRONMENT=production',
            'SECRET_KEY=your_production_secret_key',
            'DB_PASSWORD=secure_production_password',
            'REDIS_PASSWORD=secure_redis_password'
          ];
          envLines.forEach(line => {
             setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), timestamp: new Date().toISOString(), level: 'INFO', message: `  ${line}`, service: 'system' }]);
          });
      }, 1200);

      setTimeout(() => {
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Wrote 5 lines', service: 'system' }]);
         setProductionServices(prev => prev.map(s => s.name === 'Production Config' ? { ...s, status: 'operational', version: 'v1.1' } : s));
      }, 2500);
    }

    if (cmd === 'setup_ssl') {
      setProductionServices(prev => prev.map(s => s.name === 'SSL Certificates' ? { ...s, status: 'configuring' } : s));
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ mkdir -p ssl', service: 'system' }]);
      
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Created directory: ./ssl', service: 'system' }]);
      }, 800);
    }

    if (cmd === 'install_certs') {
      setProductionServices(prev => prev.map(s => s.name === 'SSL Certificates' ? { ...s, status: 'installing' } : s));
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ cp your_certificate.crt ssl/', service: 'system' }]);
      
      setTimeout(() => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ cp your_private.key ssl/', service: 'system' }]);
      }, 600);

      setTimeout(() => {
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Certificates installed successfully.', service: 'system' }]);
         setProductionServices(prev => prev.map(s => s.name === 'SSL Certificates' ? { ...s, status: 'operational', version: 'TLS 1.3' } : s));
      }, 1500);
    }

    if (cmd === 'deploy') {
      setProductionServices(prev => prev.map(s => s.name === 'Prod Environment' ? { ...s, status: 'booting' } : s));
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ docker-compose -f docker-compose.prod.yml up -d --build', service: 'system' }]);
      
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Building services...', service: 'system' }]), 500);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Step 1/8 : FROM node:18-alpine as build', service: 'system' }]), 1200);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Step 4/8 : RUN npm run build', service: 'system' }]), 2000);
      setTimeout(() => setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Successfully tagged nexus-saas:prod', service: 'system' }]), 3500);
      
      setTimeout(() => {
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Creating nexus_prod_db ... done', service: 'system' }]);
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Creating nexus_prod_api ... done', service: 'system' }]);
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Creating nexus_prod_web ... done', service: 'system' }]);
        setProductionServices(prev => prev.map(s => s.name === 'Prod Environment' ? { ...s, status: 'operational', version: 'v2.0.0-release' } : s));
      }, 4500);
    }

    if (cmd === 'check_status') {
       setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ docker-compose -f docker-compose.prod.yml ps', service: 'system' }]);
       setTimeout(() => {
            const table = [
                'NAME                COMMAND                  SERVICE             STATUS              PORTS',
                'nexus_prod_api      "uvicorn app.main:app"   api                 running             0.0.0.0:8000->8000/tcp',
                'nexus_prod_db       "docker-entrypoint.s…"   db                  running             5432/tcp',
                'nexus_prod_web      "docker-entrypoint.s…"   web                 running             0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp'
            ];
            table.forEach(line => {
                setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), timestamp: new Date().toISOString(), level: 'INFO', message: line, service: 'system' }]);
            });
       }, 600);
    }

    if (cmd === 'view_logs') {
       setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: '$ docker-compose -f docker-compose.prod.yml logs -f', service: 'system' }]);
       setTimeout(() => {
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'Attaching to nexus_prod_api, nexus_prod_db, nexus_prod_web', service: 'system' }]);
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'nexus_prod_api | INFO:     Started server process [1]', service: 'api' }]);
         setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'INFO', message: 'nexus_prod_web | 172.18.0.1 - - [12/Mar/2024:10:00:00 +0000] "GET / HTTP/1.1" 200', service: 'web' }]);
       }, 800);
    }
  };

  const runDiagnostics = () => {
    setIsChecking(true);
    const newLog: SystemLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `Running full ${envMode} diagnostics suite...`,
      service: 'system'
    };
    setLogs(prev => [...prev, newLog]);

    setTimeout(() => {
      setIsChecking(false);
      if (envMode === 'docker') {
        setDockerServices(prev => prev.map(s => ({
            ...s,
            latency: s.status === 'operational' ? Math.floor(Math.random() * (s.name.includes('AI') ? 500 : 50) + 10) + 'ms' : '-'
        })));
      }
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Diagnostics completed. All systems nominal.',
        service: 'system'
      }]);
    }, 1500);
  };

  const renderGeneral = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Organization Profile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
          <Building className="text-slate-400" size={20} />
          <h2 className="font-semibold text-slate-800">Organization Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
              <div className="relative group">
                <img src={tenant.logoUrl} alt="Logo" className="w-24 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              <p className="text-sm text-slate-500 mt-2">This is the name that will be displayed in emails and on the dashboard.</p>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={handleSave}
              disabled={isSaving || name === tenant.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaving || name === tenant.name 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
              }`}
            >
              {isSaving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50/50 flex items-center gap-2">
          <Trash2 className="text-red-400" size={20} />
          <h2 className="font-semibold text-red-800">Danger Zone</h2>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-slate-800">Delete Organization</h3>
            <p className="text-sm text-slate-500 mt-1">Once you delete your organization, there is no going back. Please be certain.</p>
          </div>
          <button className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors">
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
          <CreditCard className="text-slate-400" size={20} />
          <h2 className="font-semibold text-slate-800">Subscription Plan</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-lg border border-indigo-100 bg-indigo-50/50">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800">{tenant.plan} Plan</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">Active</span>
              </div>
              <p className="text-slate-600 text-sm mt-1">You are currently on the {tenant.plan.toLowerCase()} tier.</p>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
              Manage Subscription
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
             {['Startup', 'Growth', 'Enterprise'].map((planName) => (
               <div key={planName} className={`p-4 rounded-lg border ${tenant.plan === planName ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-200 opacity-70'}`}>
                 <h4 className="font-bold text-slate-800">{planName}</h4>
                 <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Feature 1</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Feature 2</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Feature 3</li>
                 </ul>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDockerSystem = () => (
    <>
        {/* Master Controls */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
            <h3 className="font-bold text-slate-800">Global System Control</h3>
            <p className="text-sm text-slate-500">Master switches for the container orchestration.</p>
            </div>
            <div className="flex gap-3">
            <button 
                onClick={() => handleGlobalPower('up')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm shadow-green-200 active:scale-95 transition-all"
            >
                <Play size={16} fill="currentColor" /> Start All
            </button>
            <button 
                onClick={() => handleGlobalPower('down')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium active:scale-95 transition-all"
            >
                <StopCircle size={16} /> Stop All
            </button>
            </div>
        </div>

        {/* Service Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Database size={18} className="text-indigo-600"/>
                    </div>
                    <h3 className="font-bold text-slate-800">Data Layer</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-500">db, redis</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">PostgreSQL Database and Redis Cache services.</p>
            <div className="flex gap-2">
                <button onClick={() => handleDockerGroupPower('data', 'up')} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                    <Play size={14} fill="currentColor"/> Start Group
                </button>
                <button onClick={() => handleDockerGroupPower('data', 'down')} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <StopCircle size={14} /> Stop Group
                </button>
            </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Server size={18} className="text-blue-600"/>
                    </div>
                    <h3 className="font-bold text-slate-800">App Layer</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-500">api, worker</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">API Gateway and Background Workers.</p>
            <div className="flex gap-2">
                <button onClick={() => handleDockerGroupPower('app', 'up')} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Play size={14} fill="currentColor"/> Start Group
                </button>
                <button onClick={() => handleDockerGroupPower('app', 'down')} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <StopCircle size={14} /> Stop Group
                </button>
            </div>
            </div>
        </div>

        {/* Services Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dockerServices.map((service) => {
            const isRunning = service.status === 'operational';
            const isBooting = service.status === 'booting';
            
            return (
                <div key={service.name} className={`bg-white p-4 rounded-xl border transition-all duration-300 ${
                isRunning ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-80 bg-slate-50'
                }`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg transition-colors ${isRunning ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                    {service.name.includes('DB') ? <Database size={20} /> : 
                    service.name.includes('Gateway') ? <Server size={20} /> :
                    service.name.includes('Worker') ? <Cpu size={20} /> :
                    service.name.includes('Redis') ? <Layers size={20} /> :
                    <Activity size={20} />}
                    </div>
                    <div className="flex items-center gap-2">
                    <button 
                        onClick={() => toggleDockerService(service.name)}
                        className={`p-1.5 rounded-full transition-colors ${
                        isRunning ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                        }`}
                        title={isRunning ? "Stop Service" : "Start Service"}
                    >
                        <Power size={16} />
                    </button>
                    <span className={`flex h-3 w-3 rounded-full ${isRunning ? 'bg-green-500' : isBooting ? 'bg-yellow-400' : 'bg-slate-400'}`}>
                        {isRunning && <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>}
                        {isBooting && <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75"></span>}
                    </span>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">{service.name}</h4>
                <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                    <span>Status</span>
                    <span className={`font-bold ${isRunning ? 'text-green-600' : isBooting ? 'text-yellow-600' : 'text-slate-500'}`}>
                        {service.status.toUpperCase()}
                    </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                    <span>Latency</span>
                    <span className="font-mono text-slate-700">{isRunning ? service.latency : '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                    <span>Uptime</span>
                    <span className="font-mono text-slate-600">{isRunning ? service.uptime : '0%'}</span>
                    </div>
                </div>
                </div>
            );
            })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Database Operations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Database size={24} />
                </div>
                <div>
                <h3 className="font-bold text-slate-800">Database Operations</h3>
                <p className="text-sm text-slate-500">Container: saas_db (PostgreSQL)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Connect Shell */}
                <button 
                onClick={() => handleDbAction('connect')}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600">
                    <Terminal size={20} />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-indigo-700">PSQL Shell</span>
                </button>

                {/* Backup */}
                <button 
                onClick={() => handleDbAction('backup')}
                disabled={dbStatus !== 'idle'}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <div className={`p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-green-100 text-slate-600 group-hover:text-green-600 ${dbStatus === 'backing_up' ? 'animate-pulse' : ''}`}>
                    <Save size={20} />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-green-700">
                    {dbStatus === 'backing_up' ? 'Backing up...' : 'Backup'}
                </span>
                </button>

                {/* Restore */}
                <button 
                onClick={() => handleDbAction('restore')}
                disabled={dbStatus !== 'idle'}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <div className={`p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-orange-100 text-slate-600 group-hover:text-orange-600 ${dbStatus === 'restoring' ? 'animate-pulse' : ''}`}>
                    <Upload size={20} className={dbStatus === 'restoring' ? 'animate-bounce' : ''} />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-orange-700">
                    {dbStatus === 'restoring' ? 'Restoring...' : 'Restore'}
                </span>
                </button>

                {/* Reset Admin Password */}
                 <button 
                    onClick={() => handleDbAction('reset_password')}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-pink-500 hover:bg-pink-50 transition-all group"
                >
                    <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-pink-100 text-slate-600 group-hover:text-pink-600">
                        <Lock size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm group-hover:text-pink-700">
                        Reset Admin
                    </span>
                </button>
            </div>
            </div>

            {/* Redis Operations - Added Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Layers size={24} />
                </div>
                <div>
                <h3 className="font-bold text-slate-800">Redis Operations</h3>
                <p className="text-sm text-slate-500">Container: saas_redis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CLI Connect */}
                <button 
                onClick={() => handleRedisAction('connect')}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-red-100 text-slate-600 group-hover:text-red-600">
                    <Terminal size={20} />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-red-700">Redis CLI</span>
                <span className="text-xs text-slate-400 mt-1">Interactive</span>
                </button>

                {/* Monitor */}
                <button 
                onClick={() => handleRedisAction('monitor')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all group ${
                    redisStatus === 'monitoring' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-slate-200 hover:border-red-500 hover:bg-red-50'
                }`}
                >
                <div className={`p-3 rounded-full mb-3 transition-colors ${
                    redisStatus === 'monitoring' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600'
                }`}>
                    <Eye size={20} className={redisStatus === 'monitoring' ? 'animate-pulse' : ''} />
                </div>
                <span className={`font-semibold text-sm ${redisStatus === 'monitoring' ? 'text-red-700' : 'text-slate-700 group-hover:text-red-700'}`}>
                    {redisStatus === 'monitoring' ? 'Stop Monitor' : 'Monitor'}
                </span>
                <span className={`text-xs mt-1 ${redisStatus === 'monitoring' ? 'text-red-500' : 'text-slate-400'}`}>
                    {redisStatus === 'monitoring' ? 'Streaming...' : 'redis-cli monitor'}
                </span>
                </button>
            </div>
            </div>
        </div>
    </>
  );

  const renderBackendSystem = () => (
    <>
       {/* Local Backend Header */}
       <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Code size={150} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <Laptop size={24} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Backend Development</h3>
                        <p className="text-slate-400 text-sm">Manage your local Python backend directly from the dashboard.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {/* Step 1: Dependencies */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-emerald-900/30 rounded text-emerald-400"><FileJson size={18}/></div>
                            <span className="text-xs font-mono text-slate-500">venv</span>
                        </div>
                        <h4 className="font-semibold text-slate-200 mb-1">Dependencies</h4>
                        <div className="text-xs text-slate-400 mb-3 font-mono">pip install -r reqs.txt</div>
                        <button 
                            onClick={() => runBackendCommand('install')}
                            disabled={backendServices[0].status === 'installing'}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {backendServices[0].status === 'installing' ? <RefreshCw size={12} className="animate-spin"/> : null}
                            {backendServices[0].status === 'installing' ? 'Installing...' : 'Install Packages'}
                        </button>
                    </div>

                    {/* Step 2: Migrations */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-amber-900/30 rounded text-amber-400"><Database size={18}/></div>
                            <span className="text-xs font-mono text-slate-500">alembic</span>
                        </div>
                        <h4 className="font-semibold text-slate-200 mb-1">Database</h4>
                        <div className="text-xs text-slate-400 mb-3 font-mono">alembic upgrade head</div>
                        <button 
                            onClick={() => runBackendCommand('migrate')}
                            disabled={backendServices[1].status === 'migrating'}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                             {backendServices[1].status === 'migrating' ? <RefreshCw size={12} className="animate-spin"/> : null}
                             {backendServices[1].status === 'migrating' ? 'Migrating...' : 'Run Migrations'}
                        </button>
                    </div>

                    {/* Step 3: Server */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-blue-900/30 rounded text-blue-400"><Server size={18}/></div>
                            <span className="text-xs font-mono text-slate-500">uvicorn</span>
                        </div>
                        <h4 className="font-semibold text-slate-200 mb-1">App Server</h4>
                        <div className="text-xs text-slate-400 mb-3 font-mono">uvicorn app:main --reload</div>
                        {backendServices[2].status === 'operational' ? (
                            <button 
                                onClick={() => runBackendCommand('stop')}
                                className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <StopCircle size={12} /> Stop Server
                            </button>
                        ) : (
                            <button 
                                onClick={() => runBackendCommand('start')}
                                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Play size={12} /> Start Server
                            </button>
                        )}
                    </div>
                </div>
            </div>
       </div>

       {/* Backend Services Status */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {backendServices.map((s) => (
            <div key={s.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{s.version}</p>
                </div>
                <div className="flex flex-col items-end">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                         s.status === 'operational' ? 'bg-green-100 text-green-700' :
                         s.status === 'installing' || s.status === 'migrating' ? 'bg-yellow-100 text-yellow-700' :
                         'bg-slate-100 text-slate-500'
                     }`}>
                         {s.status === 'operational' && <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />}
                         {s.status}
                     </span>
                     {s.status === 'operational' && (
                         <span className="text-[10px] text-slate-400 font-mono mt-1">{s.name === 'Local DB' ? 'Port 5432' : s.name === 'Uvicorn Server' ? 'Port 8000' : 'v3.11.2'}</span>
                     )}
                </div>
            </div>
         ))}
       </div>
    </>
  );

  const renderFrontendSystem = () => (
    <>
      {/* Local Frontend Header */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Globe size={150} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
              <FileCode size={24} className="text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Frontend Development</h3>
              <p className="text-slate-400 text-sm">Manage your local React & Vite environment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Step 1: NPM Install */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-red-900/30 rounded text-red-400"><Package size={18} /></div>
                <span className="text-xs font-mono text-slate-500">npm</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Packages</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">npm install</div>
              <button 
                onClick={() => runFrontendCommand('install')}
                disabled={frontendServices[0].status === 'installing' || frontendServices[0].status === 'operational'}
                className={`w-full py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  frontendServices[0].status === 'operational' ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {frontendServices[0].status === 'installing' ? <RefreshCw size={12} className="animate-spin"/> : frontendServices[0].status === 'operational' ? <CheckCircle2 size={12} /> : null}
                {frontendServices[0].status === 'installing' ? 'Installing...' : frontendServices[0].status === 'operational' ? 'Installed' : 'Install Dependencies'}
              </button>
            </div>

            {/* Step 2: Environment */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-700/50 rounded text-slate-300"><FileJson size={18} /></div>
                <span className="text-xs font-mono text-slate-500">config</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Environment</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">cp .env.template .env</div>
              <button 
                onClick={() => runFrontendCommand('config')}
                disabled={frontendServices[1].status === 'configuring' || frontendServices[1].status === 'operational'}
                className={`w-full py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                   frontendServices[1].status === 'operational' ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {frontendServices[1].status === 'configuring' ? <RefreshCw size={12} className="animate-spin"/> : frontendServices[1].status === 'operational' ? <CheckCircle2 size={12} /> : null}
                {frontendServices[1].status === 'configuring' ? 'Copying...' : frontendServices[1].status === 'operational' ? 'Configured' : 'Create .env'}
              </button>
            </div>

            {/* Step 3: Dev Server */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-violet-900/30 rounded text-violet-400"><Globe size={18} /></div>
                <span className="text-xs font-mono text-slate-500">vite</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Dev Server</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">npm run dev</div>
              {frontendServices[2].status === 'operational' ? (
                <button 
                  onClick={() => runFrontendCommand('stop')}
                  className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                >
                  <StopCircle size={12} /> Stop Server
                </button>
              ) : (
                <button 
                  onClick={() => runFrontendCommand('start')}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={12} /> Start Server
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frontend Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frontendServices.map((s) => (
          <div key={s.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{s.version}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                s.status === 'operational' ? 'bg-green-100 text-green-700' :
                s.status === 'installing' || s.status === 'configuring' || s.status === 'booting' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {s.status === 'operational' && <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />}
                {s.status}
              </span>
              {s.status === 'operational' && s.name === 'Vite Server' && (
                <span className="text-[10px] text-slate-400 font-mono mt-1">Port 5173</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderProductionSystem = () => (
    <>
      {/* Production Header */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Server size={150} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Production Environment</h3>
              <p className="text-slate-400 text-sm">Configure and manage your production deployment settings.</p>
            </div>
          </div>

          {/* Configuration Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Step 1: Create Config */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-700/50 rounded text-slate-300"><FileJson size={18} /></div>
                <span className="text-xs font-mono text-slate-500">config</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Create Config</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">cp .env.template .env.production</div>
              <button 
                onClick={() => runProductionCommand('create_config')}
                disabled={productionServices.find(s => s.name === 'Production Config')?.status !== 'stopped'}
                className={`w-full py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  productionServices.find(s => s.name === 'Production Config')?.status === 'operational' ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {productionServices.find(s => s.name === 'Production Config')?.status === 'installing' ? <RefreshCw size={12} className="animate-spin"/> : productionServices.find(s => s.name === 'Production Config')?.status === 'operational' ? <CheckCircle2 size={12} /> : null}
                {productionServices.find(s => s.name === 'Production Config')?.status === 'installing' ? 'Creating...' : productionServices.find(s => s.name === 'Production Config')?.status === 'operational' ? 'Created' : 'Create File'}
              </button>
            </div>

            {/* Step 2: Edit Config */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-700/50 rounded text-slate-300"><Terminal size={18} /></div>
                <span className="text-xs font-mono text-slate-500">nano</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">Edit Settings</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">nano .env.production</div>
              <button 
                onClick={() => runProductionCommand('edit_config')}
                disabled={productionServices.find(s => s.name === 'Production Config')?.status !== 'operational'}
                className={`w-full py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500`}
              >
                {productionServices.find(s => s.name === 'Production Config')?.status === 'configuring' ? <RefreshCw size={12} className="animate-spin"/> : <FileCode size={12} />}
                {productionServices.find(s => s.name === 'Production Config')?.status === 'configuring' ? 'Opening Editor...' : 'Edit Config'}
              </button>
            </div>

            {/* Step 3: SSL Setup */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-700/50 rounded text-slate-300"><Lock size={18} /></div>
                <span className="text-xs font-mono text-slate-500">ssl</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">SSL Setup</h4>
              <div className="text-xs text-slate-400 mb-3 font-mono">mkdir -p ssl && cp certs</div>
              
              <div className="flex gap-2">
                 <button 
                  onClick={() => runProductionCommand('setup_ssl')}
                  disabled={productionServices.find(s => s.name === 'SSL Certificates')?.status !== 'stopped'}
                  className={`flex-1 py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    productionServices.find(s => s.name === 'SSL Certificates')?.status !== 'stopped' ? 'bg-slate-600' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {productionServices.find(s => s.name === 'SSL Certificates')?.status === 'stopped' ? 'Mkdir' : <CheckCircle2 size={12}/>}
                </button>
                 <button 
                  onClick={() => runProductionCommand('install_certs')}
                  disabled={productionServices.find(s => s.name === 'SSL Certificates')?.status !== 'configuring'}
                  className={`flex-1 py-1.5 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    productionServices.find(s => s.name === 'SSL Certificates')?.status === 'operational' ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {productionServices.find(s => s.name === 'SSL Certificates')?.status === 'operational' ? 'Done' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        
          {/* Deployment Operations - New Section */}
          <h4 className="text-sm font-bold text-slate-300 mt-6 mb-3 px-1 uppercase tracking-wider">Deployment Operations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Deploy */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 bg-blue-600/30 rounded text-blue-400"><Rocket size={18} /></div>
                    <span className="text-xs font-mono text-slate-500">up -d</span>
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">Deploy Stack</h4>
                <div className="text-xs text-slate-400 mb-3 font-mono">docker-compose up --build</div>
                <button 
                    onClick={() => runProductionCommand('deploy')}
                    disabled={productionServices.find(s => s.name === 'Prod Environment')?.status === 'booting'}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {productionServices.find(s => s.name === 'Prod Environment')?.status === 'booting' ? <RefreshCw size={12} className="animate-spin"/> : <Play size={12} fill="currentColor" />}
                    {productionServices.find(s => s.name === 'Prod Environment')?.status === 'booting' ? 'Building...' : 'Build & Deploy'}
                </button>
             </div>

             {/* Check Status */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 bg-emerald-600/30 rounded text-emerald-400"><List size={18} /></div>
                    <span className="text-xs font-mono text-slate-500">ps</span>
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">Check Status</h4>
                <div className="text-xs text-slate-400 mb-3 font-mono">docker-compose ps</div>
                <button 
                    onClick={() => runProductionCommand('check_status')}
                    className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Activity size={12} /> View Processes
                </button>
             </div>

             {/* Logs */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 bg-orange-600/30 rounded text-orange-400"><ScrollText size={18} /></div>
                    <span className="text-xs font-mono text-slate-500">logs</span>
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">Live Logs</h4>
                <div className="text-xs text-slate-400 mb-3 font-mono">docker-compose logs -f</div>
                <button 
                    onClick={() => runProductionCommand('view_logs')}
                    className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Eye size={12} /> Attach Logs
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* Production Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productionServices.map((s) => (
          <div key={s.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{s.version}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                s.status === 'operational' ? 'bg-green-100 text-green-700' :
                s.status === 'installing' || s.status === 'configuring' || s.status === 'booting' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {s.status === 'operational' && <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />}
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderSystem = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Environment Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">System Status</h2>
        <div className="bg-slate-100 p-1 rounded-lg flex items-center">
            <button 
                onClick={() => setEnvMode('docker')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    envMode === 'docker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2"><Box size={14}/> Docker</div>
            </button>
            <button 
                onClick={() => setEnvMode('backend')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    envMode === 'backend' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2"><Code size={14}/> Backend</div>
            </button>
            <button 
                onClick={() => setEnvMode('frontend')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    envMode === 'frontend' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2"><Globe size={14}/> Frontend</div>
            </button>
             <button 
                onClick={() => setEnvMode('production')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    envMode === 'production' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2"><Server size={14}/> Production</div>
            </button>
        </div>
      </div>

      {/* Conditional Render based on mode */}
      {envMode === 'docker' && renderDockerSystem()}
      {envMode === 'backend' && renderBackendSystem()}
      {envMode === 'frontend' && renderFrontendSystem()}
      {envMode === 'production' && renderProductionSystem()}

      {/* Console & Logs - Shared but content differs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Log Console */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl shadow-lg overflow-hidden flex flex-col border border-slate-800 font-mono relative">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                  {envMode === 'docker' ? 'root@nexus-server:~# docker-compose logs -f' : 
                   envMode === 'backend' ? 'dev@localhost:~/backend$ tail -f server.log' :
                   envMode === 'frontend' ? 'dev@localhost:~/frontend$ npm run dev' :
                   'admin@production:~$'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
          </div>
          <div 
            ref={logsContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 text-[11px] md:text-xs h-80 overflow-y-auto custom-scrollbar bg-slate-950 text-slate-300 leading-relaxed"
            style={{ scrollBehavior: 'auto' }}
          >
            {logs.map((log) => (
              <div key={log.id} className="mb-1 flex gap-2 group hover:bg-white/5 px-1 -mx-1 rounded">
                <span className="text-slate-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`font-bold shrink-0 w-16 ${
                  log.service === 'api' || log.service === 'uvicorn' ? 'text-blue-400' : 
                  log.service === 'db' || log.service === 'alembic' ? 'text-purple-400' : 
                  log.service === 'npm' || log.service === 'vite' ? 'text-green-400' :
                  log.service === 'worker' || log.service === 'pip' ? 'text-orange-400' : 
                  log.service === 'redis' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {log.service}
                </span>
                <span className="text-slate-600 shrink-0">|</span>
                <span className={`break-all ${log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-slate-300'}`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="animate-pulse text-green-500 mt-2">➜  _</div>
          </div>

          {/* Floating Scroll Button */}
          {!shouldAutoScroll && (
            <button 
              onClick={() => {
                if (logsContainerRef.current) {
                  logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                  setShouldAutoScroll(true);
                }
              }}
              className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full shadow-lg shadow-black/50 transition-all hover:scale-110 active:scale-95 z-10"
              title="Scroll to bottom"
            >
              <ArrowRight className="rotate-90" size={20} />
            </button>
          )}
        </div>

        {/* Health Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Diagnostic Tools</h3>
            <button 
              onClick={runDiagnostics}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-70"
            >
              <RefreshCw size={18} className={isChecking ? "animate-spin" : ""} />
              {isChecking ? 'Running Tests...' : 'Run Health Check'}
            </button>
            
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target Endpoint</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {envMode === 'production' ? 'https://api.nexus-saas.io' : envMode === 'frontend' ? 'http://localhost:5173' : 'http://localhost:8000'}
                </code>
              </div>
               <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Status Code</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">200 OK</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Response Time</span>
                <span className="text-slate-900 font-mono">
                    {envMode === 'docker' ? '45ms' : 
                     envMode === 'backend' && backendServices[2].status === 'operational' ? '2ms' : 
                     envMode === 'frontend' && frontendServices[2].status === 'operational' ? '1ms' : 
                     envMode === 'production' && productionServices[2].status === 'operational' ? '32ms' : '-'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={80} />
            </div>
            <h3 className="font-bold text-lg mb-1">System Healthy</h3>
            <p className="text-indigo-200 text-sm mb-4">All systems are operational and handling traffic normally.</p>
            <div className="flex items-center gap-2 text-xs font-mono bg-indigo-950/50 rounded-lg p-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              {envMode === 'docker' ? 'load_balancer: active' : envMode === 'backend' ? 'uvicorn: active' : envMode === 'frontend' ? 'vite_server: active' : 'prod-lb: active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your organization, billing, and system preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1 sticky top-24">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'general' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layout size={18} /> General
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'billing' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard size={18} /> Billing & Plan
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'system' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity size={18} /> System Status
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'system' && renderSystem()}
        </div>
      </div>
    </div>
  );
};