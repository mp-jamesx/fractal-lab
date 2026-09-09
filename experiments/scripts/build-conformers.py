"""Generate illustrative 3D conformers, not experimental structures or MD trajectories."""
import json
from pathlib import Path
import numpy as np
from rdkit import Chem, rdBase
from rdkit.Chem import AllChem, rdMolDescriptors
inputs={'caffeine':'Cn1c(=O)c2c(ncn2C)n(C)c1=O','metronidazole':'Cc1ncc([N+](=O)[O-])n1CCO','aspirin':'CC(=O)Oc1ccccc1C(=O)O','cyclohexane':'C1CCCCC1'}
out={}
for index,(name,smiles) in enumerate(inputs.items()):
 mol=Chem.AddHs(Chem.MolFromSmiles(smiles));params=AllChem.ETKDGv3();params.randomSeed=9300+index
 assert AllChem.EmbedMolecule(mol,params)==0
 status=AllChem.MMFFOptimizeMolecule(mol,maxIters=2000);assert status==0
 xyz=np.array(mol.GetConformer().GetPositions());xyz-=xyz.mean(axis=0)
 assert np.linalg.matrix_rank(xyz,tol=0.01)==3
 for bond in mol.GetBonds():
  length=np.linalg.norm(xyz[bond.GetBeginAtomIdx()]-xyz[bond.GetEndAtomIdx()])
  assert .7 < length < 2.1, (name,length)
 out[name]={'name':name,'smiles':smiles,'formula':rdMolDescriptors.CalcMolFormula(mol),'method':'RDKit ETKDGv3 + MMFF94; illustrative generated conformer','rdkitVersion':rdBase.rdkitVersion,'units':'angstrom','seed':9300+index,'atoms':[{'element':a.GetSymbol(),'position':[round(float(v),5) for v in xyz[a.GetIdx()]]} for a in mol.GetAtoms()],'bonds':[{'a':b.GetBeginAtomIdx(),'b':b.GetEndAtomIdx(),'order':b.GetBondTypeAsDouble()} for b in mol.GetBonds()]}
path=Path(__file__).resolve().parents[1]/'src/editorial/data/conformers.json';path.write_text(json.dumps(out,indent=2)+'\n')
print({n:(v['formula'],len(v['atoms']),len(v['bonds'])) for n,v in out.items()})
