
export type FlareHierarchy = {
    name: string
    children: FlareHierarchyBranch[]
}

export type FlareHierarchyBranch = {
    name: string
    children: [FlareHierarchyBranch, FlareHierarchyLeaf]
}

export type FlareHierarchyLeaf = {
    name: string
    value: number
}