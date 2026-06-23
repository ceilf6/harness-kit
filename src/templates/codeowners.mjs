export default function codeownersTemplate(config) {
  const maintainer = config.maintainer;
  const lines = [];
  for (const cat of config.criticalSkeleton) {
    for (const path of cat.paths) {
      lines.push(`${path} ${maintainer}`);
    }
  }
  lines.push(`scripts/tests/ ${maintainer}`);
  return lines.join('\n') + '\n';
}
