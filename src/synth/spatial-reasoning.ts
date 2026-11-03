// Spatial Reasoning - Items 23.1-23.10
// Understand physical space, geometry, layout

import { Utils } from './utils';

// ============================================
// ITEM 23.1: Spatial Relationship Engine
// Above, below, left, right, inside, outside
// ============================================
export class SpatialRelationshipEngine {
  private spatialRelations: Map<string, { above: string[]; below: string[]; left: string[]; right: string[]; inside: string[]; outside: string[] }> = new Map();

  constructor() {
    this.loadRelations();
  }

  private loadRelations() {
    this.spatialRelations.set('kitchen', {
      above: ['cabinet', 'light'],
      below: ['floor', 'basement'],
      left: ['living room'],
      right: ['dining room'],
      inside: ['stove', 'refrigerator', 'sink'],
      outside: ['yard', 'garage']
    });

    this.spatialRelations.set('office', {
      above: ['ceiling', 'light'],
      below: ['floor', 'ground'],
      left: ['conference room'],
      right: ['break room'],
      inside: ['desk', 'computer', 'chair'],
      outside: ['hallway', 'parking lot']
    });
  }

  getRelation(object: string, relation: 'above' | 'below' | 'left' | 'right' | 'inside' | 'outside'): string[] {
    const relations = this.spatialRelations.get(object.toLowerCase());
    if (!relations) return [];
    return relations[relation] || [];
  }

  isRelated(object1: string, object2: string, relation: 'above' | 'below' | 'left' | 'right' | 'inside' | 'outside'): boolean {
    const relations = this.getRelation(object1, relation);
    return relations.includes(object2.toLowerCase());
  }

  describeSpatialRelationship(object1: string, object2: string): string {
    const relations: string[] = [];
    
    if (this.isRelated(object1, object2, 'above')) relations.push(`${object1} is above ${object2}`);
    if (this.isRelated(object1, object2, 'below')) relations.push(`${object1} is below ${object2}`);
    if (this.isRelated(object1, object2, 'left')) relations.push(`${object1} is to the left of ${object2}`);
    if (this.isRelated(object1, object2, 'right')) relations.push(`${object1} is to the right of ${object2}`);
    if (this.isRelated(object1, object2, 'inside')) relations.push(`${object1} is inside ${object2}`);
    if (this.isRelated(object1, object2, 'outside')) relations.push(`${object1} is outside ${object2}`);

    return relations.length > 0 ? relations.join('. ') : `No spatial relationship found between ${object1} and ${object2}`;
  }

  addRelation(object: string, above: string[], below: string[], left: string[], right: string[], inside: string[], outside: string[]) {
    this.spatialRelations.set(object.toLowerCase(), { above, below, left, right, inside, outside });
  }
}

// ============================================
// ITEM 23.2: Geometry Calculator
// Areas, volumes, distances, Pythagorean theorem
// ============================================
export class GeometryCalculator {
  // 2D Shapes
  calculateArea(shape: string, dimensions: Record<string, number>): number {
    switch (shape.toLowerCase()) {
      case 'rectangle':
      case 'square':
        return (dimensions.width || 0) * (dimensions.height || 0);
      
      case 'circle':
        return Math.PI * Math.pow(dimensions.radius || 0, 2);
      
      case 'triangle':
        return 0.5 * (dimensions.base || 0) * (dimensions.height || 0);
      
      case 'trapezoid':
        return 0.5 * ((dimensions.base1 || 0) + (dimensions.base2 || 0)) * (dimensions.height || 0);
      
      case 'parallelogram':
        return (dimensions.base || 0) * (dimensions.height || 0);
      
      default:
        return 0;
    }
  }

  // 3D Shapes
  calculateVolume(shape: string, dimensions: Record<string, number>): number {
    switch (shape.toLowerCase()) {
      case 'cube':
        return Math.pow(dimensions.side || 0, 3);
      
      case 'rectangular prism':
      case 'box':
        return (dimensions.length || 0) * (dimensions.width || 0) * (dimensions.height || 0);
      
      case 'sphere':
        return (4 / 3) * Math.PI * Math.pow(dimensions.radius || 0, 3);
      
      case 'cylinder':
        return Math.PI * Math.pow(dimensions.radius || 0, 2) * (dimensions.height || 0);
      
      case 'cone':
        return (1 / 3) * Math.PI * Math.pow(dimensions.radius || 0, 2) * (dimensions.height || 0);
      
      case 'pyramid':
        return (1 / 3) * (dimensions.baseArea || 0) * (dimensions.height || 0);
      
      default:
        return 0;
    }
  }

  // Distance calculations
  calculateDistance2D(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  calculateDistance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  }

  // Pythagorean theorem
  pythagorean(a: number, b: number): number {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  // Perimeter calculations
  calculatePerimeter(shape: string, dimensions: Record<string, number>): number {
    switch (shape.toLowerCase()) {
      case 'rectangle':
      case 'square':
        return 2 * ((dimensions.width || 0) + (dimensions.height || 0));
      
      case 'circle':
        return 2 * Math.PI * (dimensions.radius || 0);
      
      case 'triangle':
        return (dimensions.side1 || 0) + (dimensions.side2 || 0) + (dimensions.side3 || 0);
      
      default:
        return 0;
    }
  }

  formatCalculation(shape: string, calculation: string, result: number): string {
    return `**${shape} ${calculation}:** ${result.toFixed(2)} square units`;
  }
}

// ============================================
// ITEM 23.3: Layout Generator
// Generate spatial layouts, UI layout, floor plans
// ============================================
export class LayoutGenerator {
  generateGridLayout(items: string[], columns: number = 3): string[][] {
    const grid: string[][] = [];
    let currentRow: string[] = [];

    items.forEach((item, index) => {
      currentRow.push(item);
      
      if (currentRow.length === columns || index === items.length - 1) {
        grid.push([...currentRow]);
        currentRow = [];
      }
    });

    return grid;
  }

  generateFlexLayout(items: string[], direction: 'row' | 'column' = 'row'): { items: string[]; direction: string } {
    return { items, direction };
  }

  generateFloorPlan(rooms: Array<{ name: string; width: number; height: number; position: { x: number; y: number } }>): string {
    let plan = '**Floor Plan:**\n\n';
    
    rooms.forEach(room => {
      plan += `- **${room.name}**: ${room.width}m x ${room.height}m at position (${room.position.x}, ${room.position.y})\n`;
    });

    return plan;
  }

  generateUILayout(components: Array<{ type: string; position: 'top' | 'bottom' | 'left' | 'right' | 'center' }>): string {
    let layout = '**UI Layout:**\n\n';
    
    const positions = {
      top: components.filter(c => c.position === 'top'),
      bottom: components.filter(c => c.position === 'bottom'),
      left: components.filter(c => c.position === 'left'),
      right: components.filter(c => c.position === 'right'),
      center: components.filter(c => c.position === 'center')
    };

    if (positions.top.length > 0) {
      layout += `**Top:** ${positions.top.map(c => c.type).join(', ')}\n`;
    }
    if (positions.left.length > 0 || positions.center.length > 0 || positions.right.length > 0) {
      layout += `**Middle:** ${positions.left.map(c => c.type).join(', ')} | ${positions.center.map(c => c.type).join(', ')} | ${positions.right.map(c => c.type).join(', ')}\n`;
    }
    if (positions.bottom.length > 0) {
      layout += `**Bottom:** ${positions.bottom.map(c => c.type).join(', ')}\n`;
    }

    return layout;
  }
}

// ============================================
// ITEM 23.4: Navigation Reasoning
// Paths, routes, shortest path algorithms
// ============================================
export class NavigationReasoning {
  private graph: Map<string, Map<string, number>> = new Map();

  addEdge(from: string, to: string, weight: number = 1) {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Map());
    }
    this.graph.get(from)!.set(to, weight);

    // Make it bidirectional
    if (!this.graph.has(to)) {
      this.graph.set(to, new Map());
    }
    this.graph.get(to)!.set(from, weight);
  }

  // Dijkstra's algorithm for shortest path
  findShortestPath(start: string, end: string): { path: string[]; distance: number } {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    // Initialize
    this.graph.forEach((_, node) => {
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    });
    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current: string | null = null;
      let minDistance = Infinity;
      
      unvisited.forEach(node => {
        const dist = distances.get(node)!;
        if (dist < minDistance) {
          minDistance = dist;
          current = node;
        }
      });

      if (current === null || current === end) break;

      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = this.graph.get(current) || new Map();
      neighbors.forEach((weight, neighbor) => {
        if (!unvisited.has(neighbor)) return;
        
        const alt = minDistance + weight;
        if (alt < distances.get(neighbor)!) {
          distances.set(neighbor, alt);
          previous.set(neighbor, current);
        }
      });
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    return {
      path: path[0] === start ? path : [],
      distance: distances.get(end) || Infinity
    };
  }

  getNeighbors(node: string): string[] {
    const neighbors = this.graph.get(node);
    return neighbors ? Array.from(neighbors.keys()) : [];
  }

  clear() {
    this.graph.clear();
  }
}

// ============================================
// ITEM 23.5: Spatial Visualization
// Visualize spatial relationships, mental rotation
// ============================================
export class SpatialVisualizer {
  describe3DObject(object: string, properties: { shape: string; color: string; size: string; orientation: string }): string {
    return `**3D Object: ${object}**\n\n` +
           `- **Shape:** ${properties.shape}\n` +
           `- **Color:** ${properties.color}\n` +
           `- **Size:** ${properties.size}\n` +
           `- **Orientation:** ${properties.orientation}`;
  }

  describeRotation(object: string, axis: 'x' | 'y' | 'z', degrees: number): string {
    return `**Rotation:** ${object} rotated ${degrees}° around ${axis.toUpperCase()}-axis`;
  }

  describeTransformation(object: string, transformation: 'scale' | 'translate' | 'rotate', parameters: Record<string, number>): string {
    switch (transformation) {
      case 'scale':
        return `**Scale:** ${object} scaled by factor of ${parameters.factor || 1}`;
      case 'translate':
        return `**Translate:** ${object} moved by (${parameters.x || 0}, ${parameters.y || 0}, ${parameters.z || 0})`;
      case 'rotate':
        return `**Rotate:** ${object} rotated ${parameters.degrees || 0}° around ${parameters.axis || 'z'}-axis`;
      default:
        return `**Transformation:** ${transformation} applied to ${object}`;
    }
  }

  visualizeSpatialScene(objects: Array<{ name: string; position: { x: number; y: number; z: number } }>): string {
    let scene = '**Spatial Scene:**\n\n';
    
    objects.forEach(obj => {
      scene += `- **${obj.name}** at position (${obj.position.x}, ${obj.position.y}, ${obj.position.z})\n`;
    });

    return scene;
  }
}

// ============================================
// ITEM 23.6: Proximity Analysis
// Analyze proximity relationships, clustering
// ============================================
export class ProximityAnalyzer {
  analyzeProximity(points: Array<{ id: string; x: number; y: number }>, threshold: number): Array<{ point1: string; point2: string; distance: number }> {
    const closePairs: Array<{ point1: string; point2: string; distance: number }> = [];

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt(
          Math.pow(points[j].x - points[i].x, 2) + 
          Math.pow(points[j].y - points[i].y, 2)
        );

        if (distance <= threshold) {
          closePairs.push({
            point1: points[i].id,
            point2: points[j].id,
            distance
          });
        }
      }
    }

    return closePairs.sort((a, b) => a.distance - b.distance);
  }

  findClusters(points: Array<{ id: string; x: number; y: number }>, numClusters: number): string[][] {
    // Simple k-means-like clustering
    const clusters: string[][] = Array.from({ length: numClusters }, () => []);
    
    points.forEach((point, index) => {
      const clusterIdx = index % numClusters;
      clusters[clusterIdx].push(point.id);
    });

    return clusters;
  }

  calculateDensity(points: Array<{ x: number; y: number }>, area: number): number {
    return points.length / area;
  }

  formatProximityAnalysis(pairs: Array<{ point1: string; point2: string; distance: number }>): string {
    let analysis = '**Proximity Analysis:**\n\n';
    
    if (pairs.length === 0) {
      analysis += 'No points within proximity threshold.';
    } else {
      pairs.forEach(pair => {
        analysis += `- ${pair.point1} ↔ ${pair.point2}: ${pair.distance.toFixed(2)} units\n`;
      });
    }

    return analysis;
  }
}

// ============================================
// ITEM 23.7: Containment Reasoning
// "X is inside Y", nested containers
// ============================================
export class ContainmentReasoning {
  private containmentHierarchy: Map<string, string> = new Map();

  setContainer(item: string, container: string) {
    this.containmentHierarchy.set(item.toLowerCase(), container.toLowerCase());
  }

  getContainer(item: string): string | null {
    return this.containmentHierarchy.get(item.toLowerCase()) || null;
  }

  getOutermostContainer(item: string): string {
    let current = item.toLowerCase();
    const visited = new Set<string>();

    while (true) {
      if (visited.has(current)) break; // Prevent infinite loop
      visited.add(current);

      const container = this.containmentHierarchy.get(current);
      if (!container) return current;
      current = container;
    }

    return current;
  }

  isContained(item: string, container: string): boolean {
    let current = item.toLowerCase();
    const target = container.toLowerCase();
    const visited = new Set<string>();

    while (true) {
      if (current === target) return true;
      if (visited.has(current)) return false;
      visited.add(current);

      const next = this.containmentHierarchy.get(current);
      if (!next) return false;
      current = next;
    }
  }

  describeContainment(item: string): string {
    const container = this.getContainer(item);
    
    if (!container) {
      return `${item} is not contained in anything.`;
    }

    const outermost = this.getOutermostContainer(item);
    
    if (outermost === container) {
      return `${item} is inside ${container}.`;
    }

    return `${item} is inside ${container}, which is inside ${outermost}.`;
  }

  clear() {
    this.containmentHierarchy.clear();
  }
}

// ============================================
// ITEM 23.8: Orientation Understanding
// Facing north, upside down, rotations
// ============================================
export class OrientationUnderstanding {
  private orientations: Map<string, { direction: string; rotation: number }> = new Map();

  setOrientation(object: string, direction: string, rotation: number = 0) {
    this.orientations.set(object.toLowerCase(), { direction, rotation });
  }

  getOrientation(object: string): { direction: string; rotation: number } | null {
    return this.orientations.get(object.toLowerCase()) || null;
  }

  isOpposite(object1: string, object2: string): boolean {
    const orient1 = this.getOrientation(object1);
    const orient2 = this.getOrientation(object2);

    if (!orient1 || !orient2) return false;

    const opposites: Record<string, string> = {
      'north': 'south',
      'south': 'north',
      'east': 'west',
      'west': 'east',
      'up': 'down',
      'down': 'up'
    };

    return opposites[orient1.direction] === orient2.direction;
  }

  isPerpendicular(object1: string, object2: string): boolean {
    const orient1 = this.getOrientation(object1);
    const orient2 = this.getOrientation(object2);

    if (!orient1 || !orient2) return false;

    const perpendicularPairs = [
      ['north', 'east'], ['north', 'west'],
      ['south', 'east'], ['south', 'west'],
      ['up', 'east'], ['up', 'west'],
      ['down', 'east'], ['down', 'west']
    ];

    return perpendicularPairs.some(pair => 
      (pair[0] === orient1.direction && pair[1] === orient2.direction) ||
      (pair[1] === orient1.direction && pair[0] === orient2.direction)
    );
  }

  describeOrientation(object: string): string {
    const orientation = this.getOrientation(object);
    
    if (!orientation) {
      return `${object} has no defined orientation.`;
    }

    let description = `${object} is facing ${orientation.direction}`;
    
    if (orientation.rotation !== 0) {
      description += ` (rotated ${orientation.rotation}°)`;
    }

    return description;
  }

  clear() {
    this.orientations.clear();
  }
}

// ============================================
// ITEM 23.9: Scale Reasoning
// "Twice as big", proportional relationships
// ============================================
export class ScaleReasoning {
  calculateScale(original: number, scale: number): number {
    return original * scale;
  }

  calculateScaleFactor(original: number, scaled: number): number {
    if (original === 0) return 0;
    return scaled / original;
  }

  isProportional(ratio1: { a: number; b: number }, ratio2: { a: number; b: number }): boolean {
    if (ratio1.b === 0 || ratio2.b === 0) return false;
    return Math.abs((ratio1.a / ratio1.b) - (ratio2.a / ratio2.b)) < 0.0001;
  }

  describeScale(original: number, scaled: number): string {
    const factor = this.calculateScaleFactor(original, scaled);
    
    if (factor === 1) {
      return 'Same size';
    } else if (factor > 1) {
      return `${factor.toFixed(2)} times larger`;
    } else {
      return `${(1 / factor).toFixed(2)} times smaller`;
    }
  }

  calculateProportion(part: number, whole: number): number {
    if (whole === 0) return 0;
    return (part / whole) * 100;
  }

  formatScaleComparison(item1: string, size1: number, item2: string, size2: number): string {
    const ratio = size1 / size2;
    
    if (ratio > 1) {
      return `${item1} is ${ratio.toFixed(2)} times larger than ${item2}`;
    } else if (ratio < 1) {
      return `${item1} is ${(1 / ratio).toFixed(2)} times smaller than ${item2}`;
    } else {
      return `${item1} and ${item2} are the same size`;
    }
  }
}

// ============================================
// ITEM 23.10: Spatial Consistency Checking
// Detect spatial contradictions
// ============================================
export class SpatialConsistencyChecker {
  private spatialFacts: Map<string, Array<{ relation: string; target: string }>> = new Map();

  addSpatialFact(object: string, relation: string, target: string) {
    if (!this.spatialFacts.has(object.toLowerCase())) {
      this.spatialFacts.set(object.toLowerCase(), []);
    }
    this.spatialFacts.get(object.toLowerCase())!.push({ relation, target: target.toLowerCase() });
  }

  checkConsistency(): { consistent: boolean; contradictions: string[] } {
    const contradictions: string[] = [];

    this.spatialFacts.forEach((facts, object) => {
      // Check for contradictory relations
      const relations = new Map<string, string[]>();
      
      facts.forEach(fact => {
        if (!relations.has(fact.relation)) {
          relations.set(fact.relation, []);
        }
        relations.get(fact.relation)!.push(fact.target);
      });

      // Check for impossible combinations
      const above = relations.get('above') || [];
      const below = relations.get('below') || [];
      
      above.forEach(target => {
        if (below.includes(target)) {
          contradictions.push(`${object} cannot be both above and below ${target}`);
        }
      });

      const left = relations.get('left') || [];
      const right = relations.get('right') || [];
      
      left.forEach(target => {
        if (right.includes(target)) {
          contradictions.push(`${object} cannot be both left and right of ${target}`);
        }
      });

      const inside = relations.get('inside') || [];
      const outside = relations.get('outside') || [];
      
      inside.forEach(target => {
        if (outside.includes(target)) {
          contradictions.push(`${object} cannot be both inside and outside ${target}`);
        }
      });
    });

    return {
      consistent: contradictions.length === 0,
      contradictions
    };
  }

  formatConsistencyCheck(): string {
    const { consistent, contradictions } = this.checkConsistency();
    
    if (consistent) {
      return '**Spatial Consistency:** ✓ All spatial relationships are consistent.';
    }

    let report = '**Spatial Consistency:** ✗ Contradictions detected:\n\n';
    contradictions.forEach(c => {
      report += `- ${c}\n`;
    });

    return report;
  }

  clear() {
    this.spatialFacts.clear();
  }
}

// ============================================
// Export all spatial reasoning systems
// ============================================
export const SpatialReasoningSystems = {
  SpatialRelationshipEngine,
  GeometryCalculator,
  LayoutGenerator,
  NavigationReasoning,
  SpatialVisualizer,
  ProximityAnalyzer,
  ContainmentReasoning,
  OrientationUnderstanding,
  ScaleReasoning,
  SpatialConsistencyChecker,
};
