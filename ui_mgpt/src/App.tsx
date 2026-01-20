// 参照: openspec/changes/setup-project/specs/ui-layout/spec.md
// 参照: openspec/changes/add-ai-assistants-management/specs/ui-layout/spec.md

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import KnowledgeBaseDetailPage from './pages/KnowledgeBaseDetailPage';
import AIAssistantsPage from './pages/AIAssistantsPage';
import AIAssistantConfigPage from './pages/AIAssistantConfigPage';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/ai-assistants" replace />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="knowledge-base/new" element={<KnowledgeBaseDetailPage />} />
          <Route path="knowledge-base/:id" element={<KnowledgeBaseDetailPage />} />
          <Route path="ai-assistants" element={<AIAssistantsPage />} />
          <Route path="ai-assistants/:id" element={<AIAssistantConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

