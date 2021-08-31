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

export type FlareHierarchyItem<T = FlareTreeLevel> = D3HierarchyRectangularNode<T> & {
    current?: D3HierarchyRectangularNode<T>
    target?: {
        x0: number
        x1: number
        y0: number
        y1: number
    }
}