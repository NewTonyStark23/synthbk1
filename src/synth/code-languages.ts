// Code Languages - Items 5.1-5.10
// Generate code in multiple languages: Python, SQL, Bash, JSON/YAML, Markdown, Regex, API clients, algorithms, data structures, language adapter

import { Utils } from './utils';

// ============================================
// ITEM 5.1: Python Generator
// Data processing, scripts, automation, ML pipelines
// ============================================
export class PythonGenerator {
  generateScript(purpose: string, features: string[]): string {
    let code = `#!/usr/bin/env python3\n"""${purpose}"""\n\n`;
    
    // Imports
    const imports = new Set<string>();
    if (features.includes('data_processing')) imports.add('import pandas as pd');
    if (features.includes('ml')) imports.add('from sklearn.model_selection import train_test_split');
    if (features.includes('visualization')) imports.add('import matplotlib.pyplot as plt');
    if (features.includes('api')) imports.add('import requests');
    if (features.includes('file_io')) imports.add('import os');
    
    code += Array.from(imports).join('\n') + '\n\n';
    
    // Main function
    code += 'def main():\n';
    code += `    """${purpose}"""\n`;
    code += '    pass\n\n';
    
    code += 'if __name__ == "__main__":\n';
    code += '    main()\n';
    
    return code;
  }

  generateDataProcessor(inputFile: string, outputFile: string, operations: string[]): string {
    let code = `import pandas as pd\n\n`;
    code += `# Load data\n`;
    code += `df = pd.read_csv('${inputFile}')\n\n`;
    
    operations.forEach(op => {
      if (op === 'filter') {
        code += `# Filter data\n`;
        code += `df = df[df['column'] == 'value']\n\n`;
      }
      if (op === 'transform') {
        code += `# Transform data\n`;
        code += `df['new_column'] = df['existing_column'].apply(lambda x: x * 2)\n\n`;
      }
      if (op === 'aggregate') {
        code += `# Aggregate data\n`;
        code += `result = df.groupby('category').agg({'value': 'sum'})\n\n`;
      }
    });
    
    code += `# Save results\n`;
    code += `df.to_csv('${outputFile}', index=False)\n`;
    
    return code;
  }

  generateMLPipeline(features: string[]): string {
    let code = `import pandas as pd\n`;
    code += `from sklearn.model_selection import train_test_split\n`;
    code += `from sklearn.preprocessing import StandardScaler\n`;
    code += `from sklearn.ensemble import RandomForestClassifier\n`;
    code += `from sklearn.metrics import accuracy_score\n\n`;
    
    code += `# Load data\n`;
    code += `df = pd.read_csv('data.csv')\n\n`;
    
    code += `# Prepare features and target\n`;
    code += `X = df.drop('target', axis=1)\n`;
    code += `y = df['target']\n\n`;
    
    code += `# Split data\n`;
    code += `X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n`;
    
    code += `# Scale features\n`;
    code += `scaler = StandardScaler()\n`;
    code += `X_train_scaled = scaler.fit_transform(X_train)\n`;
    code += `X_test_scaled = scaler.transform(X_test)\n\n`;
    
    code += `# Train model\n`;
    code += `model = RandomForestClassifier(n_estimators=100, random_state=42)\n`;
    code += `model.fit(X_train_scaled, y_train)\n\n`;
    
    code += `# Evaluate\n`;
    code += `y_pred = model.predict(X_test_scaled)\n`;
    code += `accuracy = accuracy_score(y_test, y_pred)\n`;
    code += `print(f"Accuracy: {accuracy:.2f}")\n`;
    
    return code;
  }
}

// ============================================
// ITEM 5.2: SQL Generator
// Queries, schema design, optimization
// ============================================
export class SQLGenerator {
  generateSelectQuery(table: string, columns: string[], conditions?: string[], orderBy?: string): string {
    let query = `SELECT ${columns.join(', ')}\nFROM ${table}`;
    
    if (conditions && conditions.length > 0) {
      query += `\nWHERE ${conditions.join(' AND ')}`;
    }
    
    if (orderBy) {
      query += `\nORDER BY ${orderBy}`;
    }
    
    return query + ';';
  }

  generateInsertQuery(table: string, data: Record<string, any>): string {
    const columns = Object.keys(data);
    const values = Object.values(data).map(v => typeof v === 'string' ? `'${v}'` : v);
    
    return `INSERT INTO ${table} (${columns.join(', ')})\nVALUES (${values.join(', ')});`;
  }

  generateUpdateQuery(table: string, updates: Record<string, any>, conditions: string[]): string {
    const setClauses = Object.entries(updates).map(([col, val]) => 
      `${col} = ${typeof val === 'string' ? `'${val}'` : val}`
    );
    
    return `UPDATE ${table}\nSET ${setClauses.join(', ')}\nWHERE ${conditions.join(' AND ')};`;
  }

  generateCreateTableQuery(tableName: string, columns: Array<{ name: string; type: string; constraints?: string }>): string {
    const columnDefs = columns.map(col => {
      let def = `${col.name} ${col.type}`;
      if (col.constraints) def += ` ${col.constraints}`;
      return def;
    });
    
    return `CREATE TABLE ${tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }

  generateJoinQuery(table1: string, table2: string, joinColumn: string, columns: string[]): string {
    return `SELECT ${columns.join(', ')}\nFROM ${table1}\nJOIN ${table2} ON ${table1}.${joinColumn} = ${table2}.${joinColumn};`;
  }

  optimizeQuery(query: string): { optimized: string; suggestions: string[] } {
    const suggestions: string[] = [];
    let optimized = query;
    
    // Check for SELECT *
    if (query.includes('SELECT *')) {
      suggestions.push('Replace SELECT * with specific columns for better performance');
    }
    
    // Check for missing indexes
    if (query.includes('WHERE') && !query.includes('INDEX')) {
      suggestions.push('Consider adding indexes on columns used in WHERE clause');
    }
    
    // Check for subqueries
    if (query.match(/SELECT.*\(SELECT/i)) {
      suggestions.push('Consider rewriting subqueries as JOINs for better performance');
    }
    
    return { optimized, suggestions };
  }
}

// ============================================
// ITEM 5.3: Bash/Shell Generator
// System automation, DevOps scripts
// ============================================
export class BashGenerator {
  generateScript(purpose: string, commands: string[]): string {
    let script = `#!/bin/bash\n# ${purpose}\n\nset -e  # Exit on error\n\n`;
    
    commands.forEach(cmd => {
      script += `${cmd}\n`;
    });
    
    script += `\necho "Script completed successfully"\n`;
    return script;
  }

  generateDeploymentScript(appName: string, environment: string): string {
    let script = `#!/bin/bash\n# Deploy ${appName} to ${environment}\n\n`;
    
    script += `set -e\n\n`;
    script += `echo "Starting deployment of ${appName} to ${environment}..."\n\n`;
    
    script += `# Pull latest code\n`;
    script += `git pull origin main\n\n`;
    
    script += `# Install dependencies\n`;
    script += `npm install --production\n\n`;
    
    script += `# Build application\n`;
    script += `npm run build\n\n`;
    
    script += `# Restart service\n`;
    script += `systemctl restart ${appName}\n\n`;
    
    script += `echo "Deployment completed successfully"\n`;
    
    return script;
  }

  generateBackupScript(source: string, destination: string): string {
    let script = `#!/bin/bash\n# Backup ${source} to ${destination}\n\n`;
    
    script += `set -e\n\n`;
    script += `TIMESTAMP=$(date +%Y%m%d_%H%M%S)\n`;
    script += `BACKUP_DIR="${destination}/backup_\${TIMESTAMP}"\n\n`;
    
    script += `echo "Creating backup in \${BACKUP_DIR}..."\n\n`;
    
    script += `mkdir -p "\${BACKUP_DIR}"\n`;
    script += `rsync -av --progress "${source}/" "\${BACKUP_DIR}/"\n\n`;
    
    script += `echo "Backup completed: \${BACKUP_DIR}"\n`;
    
    return script;
  }

  generateMonitoringScript(service: string): string {
    let script = `#!/bin/bash\n# Monitor ${service}\n\n`;
    
    script += `while true; do\n`;
    script += `  if ! systemctl is-active --quiet ${service}; then\n`;
    script += `    echo "$(date): ${service} is down! Restarting..."\n`;
    script += `    systemctl restart ${service}\n`;
    script += `  else\n`;
    script += `    echo "$(date): ${service} is running"\n`;
    script += `  fi\n`;
    script += `  sleep 60\n`;
    script += `done\n`;
    
    return script;
  }
}

// ============================================
// ITEM 5.4: JSON/YAML Generator
// Config files, API schemas, data structures
// ============================================
export class JSONYAMLGenerator {
  generateJSON(data: any, pretty: boolean = true): string {
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  generateYAML(data: any, indent: number = 2): string {
    const toYAML = (obj: any, level: number = 0): string => {
      const spaces = ' '.repeat(level * indent);
      let yaml = '';
      
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            yaml += `${spaces}-\n${toYAML(item, level + 1)}`;
          } else {
            yaml += `${spaces}- ${item}\n`;
          }
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            yaml += `${spaces}${key}:\n${toYAML(value, level + 1)}`;
          } else {
            yaml += `${spaces}${key}: ${value}\n`;
          }
        });
      }
      
      return yaml;
    };
    
    return toYAML(data);
  }

  generateAPISchema(endpoint: string, method: string, requestBody?: any, responseBody?: any): string {
    const schema: any = {
      openapi: '3.0.0',
      info: {
        title: 'API Schema',
        version: '1.0.0'
      },
      paths: {
        [endpoint]: {
          [method.toLowerCase()]: {
            summary: `${method} ${endpoint}`,
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: responseBody || { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    };
    
    if (requestBody) {
      schema.paths[endpoint][method.toLowerCase()].requestBody = {
        content: {
          'application/json': {
            schema: requestBody
          }
        }
      };
    }
    
    return this.generateJSON(schema);
  }

  generateConfig(config: Record<string, any>): string {
    return this.generateJSON(config);
  }
}

// ============================================
// ITEM 5.5: Markdown Generator
// Documentation, READMEs, reports
// ============================================
export class MarkdownGenerator {
  generateREADME(title: string, description: string, sections: Record<string, string>): string {
    let md = `# ${title}\n\n${description}\n\n`;
    
    Object.entries(sections).forEach(([heading, content]) => {
      md += `## ${heading}\n\n${content}\n\n`;
    });
    
    return md;
  }

  generateTable(headers: string[], rows: string[][]): string {
    let table = `| ${headers.join(' | ')} |\n`;
    table += `| ${headers.map(() => '---').join(' | ')} |\n`;
    
    rows.forEach(row => {
      table += `| ${row.join(' | ')} |\n`;
    });
    
    return table;
  }

  generateCodeBlock(code: string, language: string = ''): string {
    return `\`\`\`${language}\n${code}\n\`\`\``;
  }

  generateList(items: string[], ordered: boolean = false): string {
    if (ordered) {
      return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    }
    return items.map(item => `- ${item}`).join('\n');
  }

  generateReport(title: string, sections: Array<{ heading: string; content: string }>): string {
    let report = `# ${title}\n\n`;
    
    sections.forEach(section => {
      report += `## ${section.heading}\n\n${section.content}\n\n`;
    });
    
    return report;
  }
}

// ============================================
// ITEM 5.6: Regex Generator
// Pattern matching with explanations
// ============================================
export class RegexGenerator {
  generatePattern(purpose: string): { pattern: string; explanation: string; examples: string[] } {
    const patterns: Record<string, { pattern: string; explanation: string; examples: string[] }> = {
      'email': {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        explanation: 'Matches valid email addresses',
        examples: ['user@example.com', 'john.doe@company.org']
      },
      'phone': {
        pattern: '^\\+?[1-9]\\d{1,14}$',
        explanation: 'Matches international phone numbers (E.164 format)',
        examples: ['+1234567890', '+44123456789']
      },
      'url': {
        pattern: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
        explanation: 'Matches HTTP/HTTPS URLs',
        examples: ['https://example.com', 'http://www.site.org/page']
      },
      'ip_v4': {
        pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        explanation: 'Matches IPv4 addresses',
        examples: ['192.168.1.1', '10.0.0.1']
      },
      'date_iso': {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        explanation: 'Matches ISO 8601 date format (YYYY-MM-DD)',
        examples: ['2024-01-15', '2023-12-31']
      },
      'password_strong': {
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        explanation: 'Matches strong passwords (8+ chars, uppercase, lowercase, number, special)',
        examples: ['Password1!', 'Str0ng@Pass']
      }
    };
    
    return patterns[purpose] || { pattern: '', explanation: 'Pattern not found', examples: [] };
  }

  explainPattern(pattern: string): string {
    let explanation = `**Regex Pattern:** \`${pattern}\`\n\n`;
    
    // Basic pattern analysis
    if (pattern.includes('^')) explanation += '- `^` - Start of string\n';
    if (pattern.includes('$')) explanation += '- `$` - End of string\n';
    if (pattern.includes('\\d')) explanation += '- `\\d` - Digit (0-9)\n';
    if (pattern.includes('\\w')) explanation += '- `\\w` - Word character (a-z, A-Z, 0-9, _)\n';
    if (pattern.includes('\\s')) explanation += '- `\\s` - Whitespace\n';
    if (pattern.includes('+')) explanation += '- `+` - One or more\n';
    if (pattern.includes('*')) explanation += '- `*` - Zero or more\n';
    if (pattern.includes('?')) explanation += '- `?` - Zero or one\n';
    if (pattern.includes('{')) explanation += '- `{n}` - Exactly n times\n';
    if (pattern.includes('[')) explanation += '- `[...]` - Character class\n';
    if (pattern.includes('(')) explanation += '- `(...)` - Capture group\n';
    
    return explanation;
  }

  testPattern(pattern: string, testStrings: string[]): Array<{ test: string; matches: boolean }> {
    const regex = new RegExp(pattern);
    return testStrings.map(test => ({
      test,
      matches: regex.test(test)
    }));
  }
}

// ============================================
// ITEM 5.7: API Client Generator
// REST/GraphQL clients in any language
// ============================================
export class APIClientGenerator {
  generateRESTClient(baseURL: string, endpoints: Array<{ method: string; path: string; description: string }>, language: string = 'javascript'): string {
    if (language === 'javascript') {
      return this.generateJavaScriptRESTClient(baseURL, endpoints);
    }
    if (language === 'python') {
      return this.generatePythonRESTClient(baseURL, endpoints);
    }
    return `// API client generation not supported for ${language}`;
  }

  private generateJavaScriptRESTClient(baseURL: string, endpoints: Array<{ method: string; path: string; description: string }>): string {
    let code = `// API Client for ${baseURL}\n\n`;
    code += `const API_BASE_URL = '${baseURL}';\n\n`;
    
    code += `async function apiRequest(method, path, data = null) {\n`;
    code += `  const options = {\n`;
    code += `    method,\n`;
    code += `    headers: { 'Content-Type': 'application/json' }\n`;
    code += `  };\n\n`;
    code += `  if (data) options.body = JSON.stringify(data);\n\n`;
    code += `  const response = await fetch(\`\${API_BASE_URL}\${path}\`, options);\n`;
    code += `  return response.json();\n`;
    code += `}\n\n`;
    
    endpoints.forEach(endpoint => {
      const funcName = endpoint.path.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      code += `// ${endpoint.description}\n`;
      
      if (endpoint.method === 'GET') {
        code += `async function ${funcName}() {\n`;
        code += `  return apiRequest('GET', '${endpoint.path}');\n`;
        code += `}\n\n`;
      } else if (endpoint.method === 'POST') {
        code += `async function ${funcName}(data) {\n`;
        code += `  return apiRequest('POST', '${endpoint.path}', data);\n`;
        code += `}\n\n`;
      }
    });
    
    return code;
  }

  private generatePythonRESTClient(baseURL: string, endpoints: Array<{ method: string; path: string; description: string }>): string {
    let code = `# API Client for ${baseURL}\n\n`;
    code += `import requests\n\n`;
    code += `API_BASE_URL = '${baseURL}'\n\n`;
    
    code += `def api_request(method, path, data=None):\n`;
    code += `    url = f"{API_BASE_URL}{path}"\n`;
    code += `    headers = {'Content-Type': 'application/json'}\n`;
    code += `    response = requests.request(method, url, json=data, headers=headers)\n`;
    code += `    return response.json()\n\n`;
    
    endpoints.forEach(endpoint => {
      const funcName = endpoint.path.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      code += `# ${endpoint.description}\n`;
      
      if (endpoint.method === 'GET') {
        code += `def ${funcName}():\n`;
        code += `    return api_request('GET', '${endpoint.path}')\n\n`;
      } else if (endpoint.method === 'POST') {
        code += `def ${funcName}(data):\n`;
        code += `    return api_request('POST', '${endpoint.path}', data)\n\n`;
      }
    });
    
    return code;
  }

  generateGraphQLClient(endpoint: string, queries: Array<{ name: string; query: string }>): string {
    let code = `// GraphQL Client for ${endpoint}\n\n`;
    code += `const GRAPHQL_ENDPOINT = '${endpoint}';\n\n`;
    
    code += `async function graphqlRequest(query, variables = {}) {\n`;
    code += `  const response = await fetch(GRAPHQL_ENDPOINT, {\n`;
    code += `    method: 'POST',\n`;
    code += `    headers: { 'Content-Type': 'application/json' },\n`;
    code += `    body: JSON.stringify({ query, variables })\n`;
    code += `  });\n`;
    code += `  return response.json();\n`;
    code += `}\n\n`;
    
    queries.forEach(q => {
      code += `// ${q.name}\n`;
      code += `async function ${q.name}(variables) {\n`;
      code += `  const query = \`${q.query}\`;\n`;
      code += `  return graphqlRequest(query, variables);\n`;
      code += `}\n\n`;
    });
    
    return code;
  }
}

// ============================================
// ITEM 5.8: Algorithm Generator
// Sorting, searching, graph algorithms
// ============================================
export class AlgorithmGenerator {
  generateSortingAlgorithm(algorithm: string, language: string = 'javascript'): string {
    if (language === 'javascript') {
      switch (algorithm) {
        case 'quicksort':
          return `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`;
        
        case 'mergesort':
          return `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`;
        
        default:
          return `// ${algorithm} not implemented`;
      }
    }
    return `// ${language} not supported`;
  }

  generateSearchAlgorithm(algorithm: string): string {
    switch (algorithm) {
      case 'binary_search':
        return `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;
      
      case 'bfs':
        return `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`;
      
      case 'dfs':
        return `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const result = [start];
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      result.push(...dfs(graph, neighbor, visited));
    }
  }
  return result;
}`;
      
      default:
        return `// ${algorithm} not implemented`;
    }
  }

  generateGraphAlgorithm(algorithm: string): string {
    switch (algorithm) {
      case 'dijkstra':
        return `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = [[0, start]];
  
  Object.keys(graph).forEach(node => distances[node] = Infinity);
  distances[start] = 0;
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, node] = pq.shift();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (const [neighbor, weight] of graph[node]) {
      const newDist = dist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  return distances;
}`;
      
      default:
        return `// ${algorithm} not implemented`;
    }
  }
}

// ============================================
// ITEM 5.9: Data Structure Generator
// Trees, graphs, hash tables
// ============================================
export class DataStructureGenerator {
  generateBinarySearchTree(): string {
    return `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }
  
  search(val) {
    let current = this.root;
    while (current) {
      if (val === current.val) return true;
      if (val < current.val) current = current.left;
      else current = current.right;
    }
    return false;
  }
}`;
  }

  generateHashTable(): string {
    return `class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
    this.size = size;
  }
  
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const value = key.charCodeAt(i) - 96;
      total = (total * PRIME + value) % this.size;
    }
    return total;
  }
  
  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) this.keyMap[index] = [];
    this.keyMap[index].push([key, value]);
  }
  
  get(key) {
    const index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}`;
  }

  generateGraph(): string {
    return `class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
  
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1);
  }
  
  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
}`;
  }

  generateLinkedList(): string {
    return `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  push(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }
  
  pop() {
    if (!this.head) return undefined;
    let current = this.head;
    let newTail = current;
    while (current.next) {
      newTail = current;
      current = current.next;
    }
    this.tail = newTail;
    this.tail.next = null;
    this.length--;
    if (this.length === 0) {
      this.head = null;
      this.tail = null;
    }
    return current;
  }
}`;
  }
}

// ============================================
// ITEM 5.10: Language Adapter
// Translate code patterns between languages
// ============================================
export class LanguageAdapter {
  adaptCode(code: string, fromLang: string, toLang: string): string {
    // Simple pattern-based translation
    let adapted = code;
    
    if (fromLang === 'javascript' && toLang === 'python') {
      adapted = this.javascriptToPython(code);
    } else if (fromLang === 'python' && toLang === 'javascript') {
      adapted = this.pythonToJavascript(code);
    }
    
    return adapted;
  }

  private javascriptToPython(code: string): string {
    let python = code;
    
    // Convert function declarations
    python = python.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, 'def $1($2):');
    
    // Convert const/let/var to just variable name
    python = python.replace(/(const|let|var)\s+/g, '');
    
    // Convert arrow functions
    python = python.replace(/\(([^)]*)\)\s*=>\s*{/g, 'lambda $1:');
    
    // Convert console.log to print
    python = python.replace(/console\.log\(/g, 'print(');
    
    // Convert === to ==
    python = python.replace(/===/g, '==');
    
    // Convert !== to !=
    python = python.replace(/!==/g, '!=');
    
    return python;
  }

  private pythonToJavascript(code: string): string {
    let js = code;
    
    // Convert def to function
    js = js.replace(/def\s+(\w+)\s*\(([^)]*)\):/g, 'function $1($2) {');
    
    // Convert print to console.log
    js = js.replace(/print\(/g, 'console.log(');
    
    // Convert == to ===
    js = js.replace(/==/g, '===');
    
    // Convert != to !==
    js = js.replace(/!=/g, '!==');
    
    return js;
  }

  generatePolyglot(code: string, languages: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    
    languages.forEach(lang => {
      result[lang] = this.adaptCode(code, 'javascript', lang);
    });
    
    return result;
  }
}

// ============================================
// Export all code language systems
// ============================================
export const CodeLanguageSystems = {
  PythonGenerator,
  SQLGenerator,
  BashGenerator,
  JSONYAMLGenerator,
  MarkdownGenerator,
  RegexGenerator,
  APIClientGenerator,
  AlgorithmGenerator,
  DataStructureGenerator,
  LanguageAdapter,
};
