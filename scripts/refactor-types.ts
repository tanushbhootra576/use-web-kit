import { Project, SyntaxKind, TypeAliasDeclaration, InterfaceDeclaration } from 'ts-morph';
import * as fs from 'fs';

const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
});

// Load all hook files in the new directories
project.addSourceFilesAtPaths([
    'src/bom/**/*.ts',
    'src/concurrency/**/*.ts',
    'src/dom/**/*.ts',
    'src/pipelines/**/*.ts',
    'src/state/**/*.ts'
]);

// Create or get types.ts
const typesFile = project.createSourceFile('src/core/types.ts', '', { overwrite: true });
typesFile.addStatements('// ── Shared & Public Types ──\n');

const allSourceFiles = project.getSourceFiles().filter(f => !f.getFilePath().includes('types.ts'));

for (const sf of allSourceFiles) {
    const exportedTypes: string[] = [];
    
    // Find all exported interfaces and type aliases
    const interfaces = sf.getInterfaces().filter(i => i.isExported());
    const typeAliases = sf.getTypeAliases().filter(t => t.isExported());
    
    for (const typeNode of [...interfaces, ...typeAliases]) {
        exportedTypes.push(typeNode.getName());
        
        // Copy the node to types.ts
        if (typeNode.getKind() === SyntaxKind.InterfaceDeclaration) {
            typesFile.addInterface((typeNode as InterfaceDeclaration).getStructure());
        } else {
            typesFile.addTypeAlias((typeNode as TypeAliasDeclaration).getStructure());
        }
        
        // Remove from the original file
        typeNode.remove();
    }
    
    if (exportedTypes.length > 0) {
        // Add import in the original file
        // We need to figure out relative path to core/types.ts
        // Since hooks are in src/<domain>/hook.ts, relative path is always ../core/types
        sf.addImportDeclaration({
            namedImports: exportedTypes,
            moduleSpecifier: '../core/types',
            isTypeOnly: true // best practice
        });
    }
}

// We might also need to fix cross-imports if hook A imported type from hook B.
// Actually, they used to be in `src/hooks`, so imports were like `./useWorkerPool` or `../hooks/useWorkerPool`.
// Let's fix relative imports across the project that point to other hooks.
for (const sf of allSourceFiles) {
    const imports = sf.getImportDeclarations();
    for (const imp of imports) {
        const mod = imp.getModuleSpecifierValue();
        if (mod.startsWith('./') || mod.startsWith('../')) {
            // It's a relative import. We just moved files.
            // Wait, we don't know where the target moved to without a map.
            // So we'll run `tsc --noEmit` to see what broke later and fix manually, or build a map.
        }
    }
}

project.saveSync();
console.log("Types extracted successfully!");
