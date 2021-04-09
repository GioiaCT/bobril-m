import * as b from "bobril";

export const enum Typographytype {
    h1 = "h1", h2 = "h2", h3 = "h3", h4 = "h4", h5 = "h5", h6 = "h6"
}

export interface ITypographyData {
    children: b.IBobrilChildren;
    tag: Typographytype;
}

interface ICtx extends b.BobrilCtx<ITypographyData>{
    data: ITypographyData;
}

export const Typography = b.createComponent<ITypographyData>({
    render(ctx: ICtx, me: b.IBobrilNode) {
        me.tag = ctx.data.tag;
        me.children = {tag: ctx.data.tag, children: ctx.data.children };
        b.style(me, Typographystyle);
    }
});

const Typographystyle = b.styleDef( {
    textAlign: "left",
});