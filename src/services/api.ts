import axios from 'axios';
import type { RouteRequest, BlockageRequest, GeoJSON } from '../types/api';

const ROUTING_BASE_URL = 'https://routing-web-service-ityenzhnyq-an.a.run.app';
const BUS_BASE_URL = 'https://nyc-bus-routing-k3q4yvzczq-an.a.run.app';

const api = axios.create({
  timeout: 30000,
});

/**
 * Check if the server is ready by calling allAxisTypes endpoint
 * If the call succeeds, server is ready
 * @returns true if server is ready, false otherwise
 */
export const checkServerReady = async (): Promise<boolean> => {
  try {
    await api.get<string[]>(`${BUS_BASE_URL}/allAxisTypes`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get all available road types
 * @returns JSON list of road types
 */
export const getAllRoadTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>(`${BUS_BASE_URL}/allAxisTypes`);
  return response.data;
};

/**
 * Get the valid road types (road types that can be selected for viewing)
 * @returns JSON list of road types
 */
export const getValidRoadTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>(`${ROUTING_BASE_URL}/validAxisTypes`);
  return response.data;
};

/**
 * Get GeoJSON data for a specific road type
 * @param roadType - The road type (e.g., "motorway", "primary", "secondary")
 * @returns GeoJSON data
 */
export const getRoadTypeGeoJSON = async (roadType: string): Promise<GeoJSON> => {
  const response = await api.get<GeoJSON>(`${ROUTING_BASE_URL}/axisType/${roadType}`);
  return response.data;
};

/**
 * Get the shortest route from start point to end point
 * @param routeRequest - Route request with start and end points
 * @returns GeoJSON route data
 */
export const getRoute = async (routeRequest: RouteRequest): Promise<GeoJSON> => {
  const response = await api.post<GeoJSON>(`${ROUTING_BASE_URL}/route`, routeRequest);
  return response.data;
};

/**
 * Get all blockages from the server
 * @returns GeoJSON blockage data
 */
export const getAllBlockages = async (): Promise<GeoJSON> => {
  const response = await api.get<GeoJSON>(`${ROUTING_BASE_URL}/blockage`);
  return response.data;
};

/**
 * Add a new blockage to the server
 * @param blockage - Blockage request data
 * @returns Response data
 */
export const addBlockage = async (blockage: BlockageRequest): Promise<any> => {
  const response = await api.post(`${ROUTING_BASE_URL}/blockage`, blockage);
  return response.data;
};

/**
 * Delete an existing blockage from the server
 * @param blockageName - Name of the blockage to delete
 * @returns Response data
 */
export const deleteBlockage = async (blockageName: string): Promise<any> => {
  const encodedName = encodeURIComponent(blockageName);
  console.log('Deleting blockage with name:', blockageName, 'encoded:', encodedName);
  const response = await api.delete(`${ROUTING_BASE_URL}/blockage/${encodedName}`);
  console.log('Delete blockage response:', response.status, response.data);
  return response.data;
};

