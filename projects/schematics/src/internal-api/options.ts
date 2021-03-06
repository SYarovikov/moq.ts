import { InjectionFactory } from "../L0/L0.injection-factory/injection-factory";
import { Inject, Injectable } from "@angular/core";
import { TypeofInjectionToken } from "../injector/typeof-injection-token";
import { OPTIONS } from "./injection-tokens/options.injection-token";
import { GETWORKSPACE } from "./injection-tokens/get-workspace.injection-token";
import { PATH_JOIN } from "./injection-tokens/join.injection-token";

@Injectable()
export class Options implements InjectionFactory {
    constructor(@Inject(OPTIONS)
                private readonly options: TypeofInjectionToken<typeof OPTIONS>,
                @Inject(GETWORKSPACE)
                private readonly getWorkspace: TypeofInjectionToken<typeof GETWORKSPACE>,
                @Inject(PATH_JOIN)
                private readonly join: TypeofInjectionToken<typeof PATH_JOIN>) {
        return this.factory() as any;
    }

    async factory() {
        const workspace = await this.getWorkspace("local");
        const {sourceRoot} = workspace.projects.get(this.options.project);
        return {
            internalApiPath: this.join(sourceRoot, "internal_api.ts"),
            publicApiPath: this.join(sourceRoot, "public_api.ts"),
            libPath: this.join(sourceRoot, "/lib"),
            sourceRoot: `/${sourceRoot}`
        };
    }
}
