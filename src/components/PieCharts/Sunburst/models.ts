import { D3HierarchyRectangularNode } from "../../../models"

type FlareTypeBase = {
    name: string
}

export type FlareTreeLevel = FlareBranch | FlareLeaf

export type FlareTree = FlareTypeBase & {
    children: FlareTreeLevel[]
}

export type FlareBranch = FlareTree

export type FlareLeaf = FlareTypeBase & {
    value: number
}

export type FlareHierarchyShape<T = FlareTreeLevel> = D3HierarchyRectangularNode<T> | FlareHierarchyTarget

export type FlareHierarchyItem<T = FlareTreeLevel> = D3HierarchyRectangularNode<T> & {
    current?: FlareHierarchyShape
    target?: FlareHierarchyTarget
}

export type FlareHierarchyTarget = {
    x0: number
    x1: number
    y0: number
    y1: number
    current?: D3HierarchyRectangularNode
}