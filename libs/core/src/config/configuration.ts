import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = join(process.cwd(), 'config.yaml');

export const whiteList = ['http://localhost:3000'];

export default () => {
  const yamlConfig = readFileSync(YAML_CONFIG_FILENAME, 'utf8');

  return yaml.load(yamlConfig) as Record<string, any>;
};
