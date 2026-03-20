import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { cats } from "@/lib/data/cats";
import { CAT_NAMES } from "@/lib/types";

export default function ProfilePage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-amber-900">にゃんずメンバー</h1>
        <p className="text-sm text-amber-600">
          会議を盛り上げる4匹の猫たち
        </p>
      </div>

      {CAT_NAMES.map((name) => {
        const cat = cats[name];
        return (
          <Card
            key={name}
            className={`w-full shadow-md border-2 ${cat.bgColor} border-opacity-50`}
          >
            <CardContent className="px-6 py-6">
              <div className="flex items-start gap-4">
                <CatIcon name={name} size={96} className="shrink-0" />
                <div className="space-y-2 min-w-0">
                  <div>
                    <h2 className={`text-xl font-bold ${cat.color}`}>
                      {cat.name}
                    </h2>
                    <p className="text-xs font-medium text-amber-600">
                      {cat.role}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <div>
                  <span className="text-amber-500 font-medium">猫年齢:</span>{" "}
                  <span className="text-gray-700">{cat.age}</span>
                </div>
                <div>
                  <span className="text-amber-500 font-medium">好き:</span>{" "}
                  <span className="text-gray-700">{cat.likes}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-amber-500 font-medium">苦手:</span>{" "}
                  <span className="text-gray-700">{cat.dislikes}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {cat.quotes.map((quote, i) => (
                  <p
                    key={i}
                    className={`text-sm italic ${cat.color} opacity-80`}
                  >
                    「{quote}」
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <a href="/" className="block pt-2">
        <Button
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl cursor-pointer"
        >
          トップに戻るにゃ 🐾
        </Button>
      </a>
    </div>
  );
}
